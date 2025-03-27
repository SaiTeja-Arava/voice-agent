import pyaudio
from app import transcribe

def record_from_mic(duration=5, sample_rate=16000):
    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    
    p = pyaudio.PyAudio()
    
    stream = p.open(format=FORMAT,
                   channels=CHANNELS,
                   rate=sample_rate,
                   input=True,
                   frames_per_buffer=CHUNK)
    
    print("Recording...")
    frames = []
    
    # Record for specified duration
    for _ in range(0, int(sample_rate / CHUNK * duration)):
        data = stream.read(CHUNK)
        frames.append(data)
    
    print("Finished recording")
    
    # Stop and close the stream
    stream.stop_stream()
    stream.close()
    p.terminate()
    
    # Convert frames to bytes
    audio_data = b''.join(frames)
    return audio_data

# Example usage
if __name__ == "__main__":
    audio_buffer = record_from_mic(duration=5)
    print("Python audio data length (bytes):", len(audio_buffer))
    print("Python first 10 bytes:", audio_buffer[:10])

    text = transcribe(audio_data=audio_buffer)
    print("Python transcription:", text)
    