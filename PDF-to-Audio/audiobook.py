#!/usr/bin/env python3
"""
PDF to AudioBook Converter
Converts PDF documents into audio book files (MP3/WAV).

Usage:
    python audiobook.py input.pdf
    python audiobook.py input.pdf -o output.mp3 --engine gtts
    python audiobook.py input.pdf --split-chapters --voice female
"""

import argparse
import asyncio
import json
import os
import re
import sys
from datetime import datetime

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from modules.pdf_extractor import extract_text_from_pdf, smart_extract, extract_text_with_ocr
from modules.text_cleaner import clean_text
from modules.chapter_detector import detect_chapters
from modules.tts_converter import (
    text_to_speech_offline,
    text_to_speech_online,
    text_to_speech_edge,
    list_available_voices,
)
from modules.utils import save_progress, load_progress, parse_page_range, sanitize_filename


def create_parser() -> argparse.ArgumentParser:
    """Create CLI argument parser."""
    parser = argparse.ArgumentParser(
        description="PDF to AudioBook Converter",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python audiobook.py book.pdf
  python audiobook.py book.pdf -o output.mp3 --engine gtts
  python audiobook.py book.pdf --split-chapters --rate 150
  python audiobook.py book.pdf --pages 1-20 --voice male
  python audiobook.py book.pdf --ocr --ocr-lang eng
        """,
    )

    parser.add_argument("input", nargs="?", help="Path to the input PDF file")

    # Output options
    parser.add_argument(
        "-o", "--output",
        default=None,
        help="Output audio file path (default: same name as input)",
    )
    parser.add_argument(
        "--format",
        choices=["mp3", "wav", "ogg", "flac"],
        default="mp3",
        help="Output audio format (default: mp3)",
    )

    # TTS Engine options
    parser.add_argument(
        "--engine",
        choices=["pyttsx3", "gtts", "edge-tts"],
        default="gtts",
        help="TTS engine to use (default: gtts)",
    )
    parser.add_argument(
        "--voice",
        choices=["male", "female"],
        default="female",
        help="Voice gender (default: female)",
    )
    parser.add_argument(
        "--edge-voice",
        default="en-US-AriaNeural",
        help="Edge TTS voice name (default: en-US-AriaNeural)",
    )
    parser.add_argument(
        "--rate",
        type=int,
        default=170,
        help="Speech rate in words per minute (default: 170)",
    )
    parser.add_argument(
        "--lang",
        default="en",
        help="Language code for TTS (default: en)",
    )
    parser.add_argument(
        "--volume",
        type=float,
        default=0.9,
        help="Volume level 0.0-1.0 (default: 0.9, pyttsx3 only)",
    )

    # Processing options
    parser.add_argument(
        "--pages",
        default=None,
        help='Page range to convert (e.g., "1-50", "5,10,15-20")',
    )
    parser.add_argument(
        "--split-chapters",
        action="store_true",
        help="Split audio into separate files per chapter",
    )
    parser.add_argument(
        "--ocr",
        action="store_true",
        help="Force OCR extraction (for scanned PDFs)",
    )
    parser.add_argument(
        "--ocr-lang",
        default="eng",
        help="OCR language (default: eng). Use + for multiple: eng+fra",
    )
    parser.add_argument(
        "--no-clean",
        action="store_true",
        help="Skip text cleaning step",
    )

    # Utility options
    parser.add_argument(
        "--preview",
        action="store_true",
        help="Preview extracted text without converting to audio",
    )
    parser.add_argument(
        "--list-voices",
        action="store_true",
        help="List all available TTS voices and exit",
    )
    parser.add_argument(
        "--resume",
        action="store_true",
        help="Resume a previously interrupted conversion",
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Enable verbose/debug output",
    )

    return parser


def get_edge_voice_for_gender(gender: str, lang: str = "en") -> str:
    """Map gender to Edge TTS voice."""
    voices = {
        "female": {"en": "en-US-AriaNeural", "en-US": "en-US-AriaNeural", "en-GB": "en-GB-SoniaNeural"},
        "male": {"en": "en-US-GuyNeural", "en-US": "en-US-GuyNeural", "en-GB": "en-GB-RyanNeural"},
    }
    return voices.get(gender, {}).get(lang, voices["female"]["en"])


def main() -> None:
    """Main entry point."""
    parser = create_parser()
    args = parser.parse_args()

    if args.list_voices:
        engine = "pyttsx3" if args.engine == "pyttsx3" else "edge-tts"
        list_available_voices(engine)
        return

    if not args.input:
        parser.print_help()
        return

    pdf_path = os.path.abspath(args.input)
    verbose = args.verbose

    print("\nPDF to AudioBook Converter")
    print("=" * 50)
    print(f"Input: {pdf_path}")

    # Step 1: Validate input file
    if not os.path.exists(pdf_path):
        print(f"Error: File '{pdf_path}' not found.")
        sys.exit(1)

    if not pdf_path.lower().endswith(".pdf"):
        print("Error: File must be a PDF.")
        sys.exit(1)

    # Get total pages for page range parsing
    page_range = None
    try:
        try:
            from pypdf import PdfReader
        except ImportError:
            from PyPDF2 import PdfReader
        with open(pdf_path, "rb") as f:
            reader = PdfReader(f)
            total_pages = len(reader.pages)
        if args.pages:
            page_range = parse_page_range(args.pages, total_pages)
    except Exception:
        total_pages = 999

    # Step 2: Extract text
    print("\nStep 1/5: Extracting text...")
    if args.ocr:
        text = extract_text_with_ocr(pdf_path, args.ocr_lang, page_range, verbose)
    else:
        text = smart_extract(pdf_path, force_ocr=False, ocr_language=args.ocr_lang, page_range=page_range, verbose=verbose)

    if not text or len(text.strip()) < 10:
        print("Error: No text could be extracted from the PDF.")
        print("   Try using --ocr flag for scanned PDFs.")
        sys.exit(1)

    print(f"   Extracted {len(text)} characters")

    # Step 3: Clean text
    if not args.no_clean:
        print("\nStep 2/5: Cleaning text...")
        text = clean_text(text)
        print(f"   Cleaned text: {len(text)} characters")
    else:
        print("\nStep 2/5: Skipping text cleaning (--no-clean)")

    # Step 4: Preview mode
    if args.preview:
        print("\nPreview (first 1000 characters):")
        print("-" * 50)
        print(text[:1000])
        print("-" * 50)
        print(f"\nTotal characters: {len(text)}")
        print(f"Estimated words: {len(text.split())}")
        return

    # Step 5: Detect chapters
    print("\nStep 3/5: Detecting chapters...")
    if args.split_chapters:
        chapters = detect_chapters(text)
        print(f"   Found {len(chapters)} chapters")
        for ch in chapters:
            print(f"      - {ch['title']}")
    else:
        chapters = [{"title": "Full Book", "content": text, "index": 1}]

    # Step 6: Set up output
    print("\nStep 4/5: Setting up output...")
    book_name = os.path.splitext(os.path.basename(pdf_path))[0]
    output_dir = os.path.join("output", sanitize_filename(book_name, 100))
    os.makedirs(output_dir, exist_ok=True)

    if args.output:
        output_base = args.output
        if not os.path.isabs(output_base):
            output_base = os.path.join(output_dir, os.path.basename(output_base))
    else:
        output_base = os.path.join(output_dir, f"{book_name}.{args.format}")

    # Resume support
    start_chapter = 0
    if args.resume:
        progress = load_progress()
        if progress and progress.get("pdf_path") == pdf_path:
            start_chapter = progress.get("current_chapter", 0)
            print(f"   Resuming from chapter {start_chapter + 1}/{len(chapters)}")

    # Step 7: Convert to audio
    print("\nStep 5/5: Converting to audio...")
    print(f"   Engine: {args.engine}")
    print(f"   Voice: {args.voice}")
    print(f"   Format: {args.format}")
    print()

    audio_files = []
    chapters_to_process = chapters[start_chapter:]

    for i, chapter in enumerate(chapters_to_process):
        actual_index = start_chapter + i + 1
        if args.split_chapters:
            safe_title = sanitize_filename(chapter["title"], 50)
            output_path = os.path.join(
                output_dir,
                f"Chapter_{actual_index:02d}_{safe_title}.{args.format}",
            )
        else:
            output_path = output_base

        print(f"   Converting: {chapter['title'][:50]}...")

        success = False
        if args.engine == "pyttsx3":
            success = text_to_speech_offline(
                chapter["content"],
                output_path,
                voice_gender=args.voice,
                rate=args.rate,
                volume=args.volume,
                progress_callback=print if verbose else None,
            )
        elif args.engine == "gtts":
            success = text_to_speech_online(
                chapter["content"],
                output_path,
                language=args.lang,
                progress_callback=print if verbose else None,
            )
        elif args.engine == "edge-tts":
            voice = args.edge_voice if hasattr(args, "edge_voice") else get_edge_voice_for_gender(args.voice, args.lang)
            success = text_to_speech_edge(
                chapter["content"],
                output_path,
                voice=voice,
                progress_callback=print if verbose else None,
            )

        if success:
            audio_files.append(output_path)
            save_progress(pdf_path, actual_index, len(chapters), audio_files)
        else:
            print(f"   Warning: Failed to convert {chapter['title']}")

    # Step 8: Save metadata
    metadata = {
        "title": book_name,
        "source": pdf_path,
        "chapters": len(chapters),
        "engine": args.engine,
        "voice": args.voice,
        "language": args.lang,
        "format": args.format,
        "created": str(datetime.now()),
        "files": audio_files,
    }

    metadata_path = os.path.join(output_dir, "metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)

    # Save transcript
    transcript_path = os.path.join(output_dir, "transcript.txt")
    with open(transcript_path, "w", encoding="utf-8") as f:
        f.write(text)

    # Done
    print("\n" + "=" * 50)
    print("AudioBook created successfully!")
    print(f"Output folder: {output_dir}")
    print(f"Files generated: {len(audio_files)}")
    print(f"Transcript saved: {transcript_path}")
    print(f"Metadata saved: {metadata_path}")
    print("=" * 50 + "\n")


if __name__ == "__main__":
    main()
