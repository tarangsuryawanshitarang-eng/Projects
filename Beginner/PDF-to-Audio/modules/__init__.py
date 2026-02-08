"""PDF to AudioBook Converter - Core modules."""

from .pdf_extractor import extract_text_from_pdf, smart_extract, extract_text_with_ocr, is_scanned_pdf
from .text_cleaner import clean_text
from .chapter_detector import detect_chapters
from .tts_converter import text_to_speech_offline, text_to_speech_online, text_to_speech_edge
from .audio_processor import post_process_audio
from .utils import split_text_into_chunks, save_progress, load_progress

__all__ = [
    'extract_text_from_pdf',
    'smart_extract',
    'extract_text_with_ocr',
    'is_scanned_pdf',
    'clean_text',
    'detect_chapters',
    'text_to_speech_offline',
    'text_to_speech_online',
    'text_to_speech_edge',
    'post_process_audio',
    'split_text_into_chunks',
    'save_progress',
    'load_progress',
]
