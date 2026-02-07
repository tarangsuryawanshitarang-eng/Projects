"""
Audio Post-Processing Module (Phase 9b)
Enhances generated audiobook quality.
"""

from typing import Optional


def post_process_audio(
    input_path: str,
    output_path: Optional[str] = None,
    add_silence_ms: int = 0,
    bitrate: str = "192k",
    normalize: bool = True
) -> str:
    """
    Enhance the audio quality of generated audiobook.
    
    Args:
        input_path: Path to input audio file
        output_path: Output path (default: overwrites input)
        add_silence_ms: Add silence at end (ms)
        bitrate: MP3 bitrate for export
        normalize: Normalize volume for consistent loudness
    
    Returns:
        Path to processed audio file
    """
    try:
        from pydub import AudioSegment, effects
    except ImportError:
        raise ImportError("pydub required. Run: pip install pydub")

    if output_path is None:
        output_path = input_path

    audio = AudioSegment.from_file(input_path)

    if normalize:
        try:
            audio = effects.normalize(audio)
        except Exception:
            pass  # Some formats may not support normalize

    if add_silence_ms > 0:
        silence = AudioSegment.silent(duration=add_silence_ms)
        audio = audio + silence

    # Determine format from extension
    fmt = "mp3"
    if output_path.lower().endswith('.wav'):
        fmt = "wav"
    elif output_path.lower().endswith('.ogg'):
        fmt = "ogg"
    elif output_path.lower().endswith('.flac'):
        fmt = "flac"

    if fmt == "mp3":
        audio.export(
            output_path,
            format="mp3",
            bitrate=bitrate,
            parameters=["-q:a", "0"]
        )
    else:
        audio.export(output_path, format=fmt)

    return output_path
