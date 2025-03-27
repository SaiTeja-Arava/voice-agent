import mic from "mic";
import axios from "axios";
import say from "say";
import { Porcupine } from "@picovoice/porcupine-node";
// Porcupine configuration
const ACCESS_KEY = 'kBd4R8tSzjxFvqWhBfFTK1tSRaVc2S6e2fMZcqLDstdDrgFaWGaoGw==';
const keywordPath = '/Users/saitejaarava/Documents/playground/arena/test/mcp-server/client/src/spark_en_mac_v3_0_0.ppn';
const porcupine = new Porcupine(ACCESS_KEY, [keywordPath], [0.9]); // Sensitivity: 0.9
// Microphone configuration
const SAMPLE_RATE = 16000; // 16kHz for Porcupine and server
const micInstance = mic({
    rate: SAMPLE_RATE.toString(),
    channels: '1',
    bitwidth: '16', // 16-bit signed integer for Porcupine
    encoding: 'signed-integer',
});
const micInputStream = micInstance.getAudioStream();
// State and buffers
let wakeWordDetected = false;
let audioBuffer = Buffer.alloc(0);
let silenceBuffer = Buffer.alloc(0);
// Silence detection parameters
const SILENCE_THRESHOLD = 200; // Adjust based on your environment (lower value = more sensitive)
const SILENCE_DURATION = 1.5; // Seconds of silence to consider the user done speaking
const MAX_RECORDING_DURATION = 15; // Maximum recording duration (seconds) as a safety measure
let lastAudioTime = 0;
let recordingStartTime = 0;
// Function to check if a buffer contains silence
function isSilence(buffer) {
    // Convert buffer to Int16Array to check audio levels
    const samples = new Int16Array(buffer.buffer, buffer.byteOffset, buffer.length / 2);
    // Calculate RMS (Root Mean Square) of the audio chunk
    let sum = 0;
    for (let i = 0; i < samples.length; i++) {
        sum += samples[i] * samples[i];
    }
    const rms = Math.sqrt(sum / samples.length);
    // Debug: Log RMS value occasionally to help fine-tune the threshold
    if (Math.random() < 0.01)
        console.log('Current RMS:', rms);
    return rms < SILENCE_THRESHOLD;
}
// Function to send audio to server and process response
async function processAudio(audioData) {
    console.log(`Processing audio of length: ${audioData.length} bytes (${audioData.length / (SAMPLE_RATE * 2)} seconds)`);
    try {
        const response = await axios.post('http://localhost:8000/transcribe', audioData, {
            headers: { 'Content-Type': 'application/octet-stream' },
            responseType: 'json',
        });
        const { transcription, response: ollamaResponse } = response.data;
        console.log('Transcription:', transcription);
        console.log('Response:', ollamaResponse);
        say.speak(ollamaResponse || "I didn't catch that");
    }
    catch (error) {
        console.error('Error processing:', error.response?.data?.error || error.message);
        say.speak("Sorry, I encountered an error processing your request");
    }
}
// Handle audio data from microphone
micInputStream.on('data', (data) => {
    const currentTime = Date.now() / 1000; // Current time in seconds
    // Process audio for wake word detection (only if not already in listening mode)
    if (!wakeWordDetected) {
        const frameLength = porcupine.frameLength; // 512 samples
        for (let i = 0; i < data.length; i += frameLength * 2) { // 2 bytes per sample
            const frame = data.slice(i, i + frameLength * 2);
            if (frame.length === frameLength * 2) {
                const samples = new Int16Array(frame.buffer, frame.byteOffset, frameLength);
                // console.log(samples)
                try {
                    const result = porcupine.process(samples);
                    if (result === 0) { // Wake word detected
                        console.log('Wake word "spark" detected!');
                        wakeWordDetected = true;
                        audioBuffer = Buffer.alloc(0); // Reset buffer
                        silenceBuffer = Buffer.alloc(0); // Reset silence buffer
                        lastAudioTime = currentTime;
                        recordingStartTime = currentTime;
                        // Provide audio feedback that wake word was detected
                        say.speak("Listening...");
                        break; // Exit the for loop once wake word is detected
                    }
                }
                catch (error) {
                    console.error("Error processing audio frame:", error);
                }
            }
        }
    }
    // Process speech after wake word detection
    if (wakeWordDetected) {
        // Update the last audio time
        lastAudioTime = currentTime;
        // Add data to audio buffer
        audioBuffer = Buffer.concat([audioBuffer, data]);
        // Check if this chunk is silence
        if (isSilence(data)) {
            silenceBuffer = Buffer.concat([silenceBuffer, data]);
            // If we've collected enough silence, process the audio
            if (silenceBuffer.length >= SAMPLE_RATE * SILENCE_DURATION * 2) {
                console.log(`Detected ${SILENCE_DURATION}s of silence, processing command`);
                const audioToSend = audioBuffer.slice(0, audioBuffer.length - silenceBuffer.length);
                audioBuffer = Buffer.alloc(0);
                silenceBuffer = Buffer.alloc(0);
                wakeWordDetected = false;
                // Only process if we have enough meaningful audio
                if (audioToSend.length > SAMPLE_RATE * 0.5 * 2) { // At least 0.5 seconds of audio
                    processAudio(audioToSend);
                }
                else {
                    console.log("Audio too short, ignoring");
                    say.speak("I didn't hear anything");
                }
            }
        }
        else {
            // Reset silence buffer if we get non-silence
            silenceBuffer = Buffer.alloc(0);
        }
        // Safety timeout: if recording has been going on too long, cut it off
        if (currentTime - recordingStartTime > MAX_RECORDING_DURATION) {
            console.log(`Reached maximum recording duration of ${MAX_RECORDING_DURATION}s`);
            const audioToSend = audioBuffer;
            audioBuffer = Buffer.alloc(0);
            silenceBuffer = Buffer.alloc(0);
            wakeWordDetected = false;
            processAudio(audioToSend);
        }
    }
});
micInputStream.on('error', (err) => {
    console.error('Mic error:', err);
});
// Start recording
console.log('Listening for "spark"... Press Ctrl+C to stop.');
micInstance.start();
// Handle process termination
process.on('SIGINT', () => {
    micInstance.stop();
    porcupine.release();
    console.log('Stopped recording.');
    process.exit();
});
