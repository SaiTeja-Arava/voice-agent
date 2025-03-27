# from faster_whisper import WhisperModel
# import numpy as np

# model = WhisperModel("small")

# def transcribe(audio_data=None, file_path=None):
#     if file_path:
#         segments, info = model.transcribe(file_path, word_timestamps=True)
#     elif audio_data is not None:
#         # Convert raw audio bytes to numpy array
#         # Assuming 16-bit samples (2 bytes per sample) and 16kHz sample rate
#         audio_array = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0
#         # Transcribe directly from the audio array
#         segments, info = model.transcribe(audio_array, word_timestamps=True)
#     else:
#         raise ValueError("Either audio_data or file_path must be provided")
    
#     text = " ".join([segment.text for segment in segments]).strip()

#     return text

# BOTH FASTER WHISPER AND WHISPER SNIPPETS WILL WORK JST ADDED TO COMPARE THEM

import whisper
import numpy as np

# Load the Whisper model (use "small" to match your original code)
model = whisper.load_model("small")

def transcribe(audio_data=None, file_path=None):
    if file_path:
        # Transcribe directly from the audio file
        result = model.transcribe(file_path, word_timestamps=True)
    elif audio_data is not None:
        # Convert raw audio bytes to numpy array
        # Assuming 16-bit samples (2 bytes per sample) and 16kHz sample rate
        audio_array = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0
        # Whisper expects audio to be at 16kHz; no need for additional preprocessing
        result = model.transcribe(audio_array, word_timestamps=True)
    else:
        raise ValueError("Either audio_data or file_path must be provided")
    
    # Extract the full text from the result
    text = result["text"].strip()

    return text