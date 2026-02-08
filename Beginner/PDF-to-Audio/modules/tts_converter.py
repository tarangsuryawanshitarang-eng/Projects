"""
Text-to-Speech Conversion Module (Phase 3, 4, 9a)
Supports pyttsx3 (offline), gTTS (online), and edge-tts (online, high quality).
"""

import asyncio
import os
from typing import Callable, Optional

from .utils import split_text_into_chunks


def text_to_speech_offline(
    text: str,
    output_path: str = "audiobook.mp3",
    voice_gender: str = "female",
    rate: int = 170,
    volume: float = 0.9,
    progress_callback: Optional[Callable[[str], None]] = None
) -> bool:
    """
    Convert text to speech using pyttsx3 (offline).
    
    Note: pyttsx3 saves as WAV on Windows. Use pydub to convert to MP3 if needed.
    
    Args:
        text: Text to convert
        output_path: Output file path
        voice_gender: 'male' or 'female'
        rate: Words per minute (default 170)
        volume: 0.0 to 1.0
        progress_callback: Optional callback for progress updates
    
    Returns:
        True if successful
    """
    try:
        import pyttsx3
    except ImportError:
        if progress_callback:
            progress_callback("Error: pyttsx3 not installed. Run: pip install pyttsx3")
        return False

    if not text or not text.strip():
        if progress_callback:
            progress_callback("Error: No text to convert")
        return False

    try:
        engine = pyttsx3.init()
        voices = engine.getProperty('voices')

        for voice in voices:
            name_lower = voice.name.lower()
            if voice_gender.lower() == "female" and "female" in name_lower:
                engine.setProperty('voice', voice.id)
                break
            elif voice_gender.lower() == "male" and "male" in name_lower:
                engine.setProperty('voice', voice.id)
                break

        engine.setProperty('rate', rate)
        engine.setProperty('volume', volume)

        if progress_callback:
            progress_callback(f"Converting to audio: {output_path}")

        # pyttsx3 on Windows typically saves as WAV
        # Ensure .wav extension for pyttsx3, then convert if MP3 requested
        base_path = output_path
        if output_path.lower().endswith('.mp3'):
            base_path = output_path[:-4] + '.wav'

        engine.save_to_file(text, base_path)
        engine.runAndWait()

        # Convert to MP3 if needed
        if output_path.lower().endswith('.mp3') and base_path != output_path:
            try:
                from pydub import AudioSegment
                audio = AudioSegment.from_wav(base_path)
                audio.export(output_path, format="mp3")
                os.remove(base_path)
            except Exception:
                os.rename(base_path, output_path)

        if progress_callback:
            progress_callback(f"Audio saved to: {output_path}")
        return True

    except Exception as e:
        if progress_callback:
            progress_callback(f"Error: {e}")
        return False


def text_to_speech_online(
    text: str,
    output_path: str = "audiobook.mp3",
    language: str = "en",
    slow: bool = False,
    progress_callback: Optional[Callable[[str], None]] = None
) -> bool:
    """
    Convert text to speech using Google TTS (online).
    
    Splits long text into chunks and merges audio.
    
    Args:
        text: Text to convert
        output_path: Output file path
        language: Language code (en, es, fr, de, hi, ja, etc.)
        slow: Use slower speech
        progress_callback: Optional callback for progress
    
    Returns:
        True if successful
    """
    try:
        from gtts import gTTS
        from pydub import AudioSegment
        from tqdm import tqdm
    except ImportError as e:
        if progress_callback:
            progress_callback(f"Error: gTTS/pydub not installed. Run: pip install gTTS pydub")
        return False

    if not text or not text.strip():
        if progress_callback:
            progress_callback("Error: No text to convert")
        return False

    max_chars = 5000
    chunks = split_text_into_chunks(text, max_chars)
    total_chunks = len(chunks)

    if progress_callback:
        progress_callback(f"Text split into {total_chunks} chunks")

    temp_files = []

    try:
        chunk_list = list(enumerate(chunks))
        chunk_iter = tqdm(chunk_list, desc="Converting") if not progress_callback else chunk_list

        for i, chunk in chunk_iter:
            try:
                tts = gTTS(text=chunk, lang=language, slow=slow)
                temp_path = f"temp_chunk_{i}.mp3"
                tts.save(temp_path)
                temp_files.append(temp_path)
                if progress_callback:
                    progress_callback(f"Converted chunk {i + 1}/{total_chunks}")
            except Exception as e:
                if progress_callback:
                    progress_callback(f"Error converting chunk {i + 1}: {e}")
                continue

        if temp_files:
            if progress_callback:
                progress_callback("Merging audio chunks...")
            
            merged_audio = AudioSegment.from_mp3(temp_files[0])
            for temp_file in temp_files[1:]:
                chunk_audio = AudioSegment.from_mp3(temp_file)
                merged_audio += chunk_audio

            merged_audio.export(output_path, format="mp3")
            if progress_callback:
                progress_callback(f"Audio saved to: {output_path}")

            for temp_file in temp_files:
                try:
                    os.remove(temp_file)
                except OSError:
                    pass

            return True
        else:
            if progress_callback:
                progress_callback("Error: No audio chunks were generated.")
            return False

    except Exception as e:
        for temp_file in temp_files:
            try:
                os.remove(temp_file)
            except OSError:
                pass
        if progress_callback:
            progress_callback(f"Error: {e}")
        return False


def text_to_speech_edge(
    text: str,
    output_path: str = "audiobook.mp3",
    voice: str = "en-US-AriaNeural",
    rate: str = "+0%",
    progress_callback: Optional[Callable[[str], None]] = None
) -> bool:
    """
    Convert text to speech using Microsoft Edge TTS (online, high quality).
    
    Chunks long text to handle Edge TTS limits (~5000 chars).
    
    Args:
        text: Text to convert
        output_path: Output file path
        voice: Edge TTS voice (e.g., en-US-AriaNeural, en-US-GuyNeural)
        rate: Speech rate adjustment (+0%, +10%, -10%, etc.)
        progress_callback: Optional callback for progress
    
    Returns:
        True if successful
    """
    try:
        import edge_tts
        from pydub import AudioSegment
    except ImportError as e:
        if progress_callback:
            progress_callback(f"Error: edge-tts/pydub not installed. Run: pip install edge-tts pydub")
        return False

    if not text or not text.strip():
        if progress_callback:
            progress_callback("Error: No text to convert")
        return False

    max_chars = 4500  # Edge TTS limit
    chunks = split_text_into_chunks(text, max_chars)

    async def _convert_chunk(idx: int, chunk: str, temp_path: str) -> None:
        communicate = edge_tts.Communicate(chunk, voice, rate=rate)
        await communicate.save(temp_path)

    try:
        if progress_callback:
            progress_callback(f"Converting with Edge TTS: {output_path} ({len(chunks)} chunks)")

        temp_files = []
        for i, chunk in enumerate(chunks):
            temp_path = f"temp_edge_{i}.mp3"
            asyncio.run(_convert_chunk(i, chunk, temp_path))
            temp_files.append(temp_path)
            if progress_callback and len(chunks) > 1:
                progress_callback(f"Converted chunk {i + 1}/{len(chunks)}")

        if len(temp_files) == 1:
            os.rename(temp_files[0], output_path)
        else:
            merged = AudioSegment.from_mp3(temp_files[0])
            for tf in temp_files[1:]:
                merged += AudioSegment.from_mp3(tf)
            merged.export(output_path, format="mp3")
            for tf in temp_files:
                try:
                    os.remove(tf)
                except OSError:
                    pass

        if progress_callback:
            progress_callback(f"Audio saved to: {output_path}")
        return True

    except Exception as e:
        if progress_callback:
            progress_callback(f"Error: {e}")
        return False


def list_available_voices(engine: str = "pyttsx3") -> None:
    """List available TTS voices for the specified engine."""
    if engine == "pyttsx3":
        try:
            import pyttsx3
            eng = pyttsx3.init()
            voices = eng.getProperty('voices')
            print("\nAvailable pyttsx3 voices:")
            for i, voice in enumerate(voices):
                print(f"  {i}: {voice.name} ({voice.languages})")
        except Exception as e:
            print(f"Error: {e}")
    elif engine == "edge-tts":
        async def _list():
            import edge_tts
            voices = await edge_tts.list_voices()
            print("\nAvailable Edge TTS voices (English):")
            for v in voices:
                if v["Locale"].startswith("en"):
                    print(f"  {v['ShortName']}: {v['Gender']} - {v.get('Locale', '')}")
        try:
            asyncio.run(_list())
        except Exception as e:
            print(f"Error: {e}")
