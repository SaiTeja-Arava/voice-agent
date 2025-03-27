import { writable } from "svelte/store";
import { nats, type ChatResponse, type Message } from "./nats";

export const transcribedText = writable("")

export const messages: Message[] = []

// Audio context setup
//@ts-ignore
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: BlobPart[] = [];
export let isRecording = false;

// Initialize the audio system
export async function initAudioSystem() {
    await nats.start();
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
            sampleRate: 16000,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: 1,
        },
    });
    console.log("Microphone access granted");
    mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

    mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        // await transcribe(audioBlob);
        // await playBufferedAudio(audioBlob);
        processAudio(audioBlob)
        audioChunks = [];
    };
}

// Start/stop recording
export function startRecording() {
    if (mediaRecorder && !isRecording) {
        audioChunks = [];
        window.speechSynthesis.cancel()
        mediaRecorder.start();
        isRecording = true;
        console.log("Recording started");
    }
}

export function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        console.log("Recording stopped");
    }
}

// Resample audio to 16kHz
async function resampleAudio(audioBuffer: AudioBuffer, targetSampleRate: number = 16000): Promise<Float32Array> {
    const offlineContext = new OfflineAudioContext(
        1, // Mono
        Math.round(audioBuffer.duration * targetSampleRate),
        targetSampleRate
    );
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start(0);
    const renderedBuffer = await offlineContext.startRendering();
    return renderedBuffer.getChannelData(0);
}

// Transcribe with resampling
export async function transcribe(audioBlob: Blob) {
    if (!nats.nc) throw new Error("NATS connection not established");

    try {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        let pcmData = audioBuffer.getChannelData(0);
        if (audioBuffer.sampleRate !== 16000) {
            pcmData = await resampleAudio(audioBuffer, 16000);
            // console.log("raw data-",pcmData)
        }

        const int16Data = convertFloat32ToInt16(pcmData);

        const uint8Data = new Uint8Array(int16Data.buffer);

        const res = await nats.nc.request("keus-transcribe", uint8Data, { timeout: 30 * 1000 });
        const decodedResponse = <{ text: string }>nats.jc.decode(res.data);
        console.log("Transcription result:", decodedResponse);

        return decodedResponse?.text?.replaceAll(',', " ") || "";
    } catch (error) {
        console.error("Error during transcription:", error);
        throw error;
    }
}

// Convert Float32 to Int16
function convertFloat32ToInt16(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
        int16Array[i] = Math.max(-32768, Math.min(32767, Math.round(float32Array[i] * 32767)));
    }
    return int16Array;
}

async function processAudio(audio: Blob) {
    const decodedText = await transcribe(audio)

    if (!decodedText) {
        speakText("soryy, I did'nt get it, please try again")
        return
    }

    transcribedText.set(decodedText)

    messages.push({
        role: 'user',
        content: decodedText
    })

    const res = <ChatResponse>await nats.request("handle-text", messages)

    messages.push(res.message)

    speakText(res.message.content)

    console.log("response from ollama :", res.message)
}

// Play audio for debugging
export async function playBufferedAudio(audioBlob: Blob) {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
    console.log("Playing buffered audio");
}

function speakText(text: string) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        // console.log(window.speechSynthesis.getVoices())
        window.speechSynthesis.speak(utterance);
    } else {
        console.error('Speech synthesis not supported.');
    }
}

// for(const voice of )