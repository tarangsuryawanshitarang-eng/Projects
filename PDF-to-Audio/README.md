# PDF to AudioBook Converter

Convert PDF documents into audiobooks (MP3/WAV) using Text-to-Speech. Supports text-based and scanned PDFs, multiple TTS engines, and chapter splitting.

## Features

- **PDF Text Extraction** — pypdf for text-based PDFs
- **OCR Support** — Tesseract OCR for scanned/image-based PDFs
- **Text Cleaning** — Removes page numbers, expands abbreviations, cleans formatting
- **Chapter Detection** — Auto-detect chapters and split into separate audio files
- **Multiple TTS Engines**:
  - **pyttsx3** — Offline, no internet required
  - **gTTS** — Google TTS, natural voice, requires internet
  - **edge-tts** — Microsoft Edge TTS, high quality, free
- **CLI & GUI** — Command-line and graphical interface

## Quick Start

```bash
# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Basic conversion
python audiobook.py your_book.pdf

# 4. Or launch GUI
python gui.py
```

## CLI Usage

```bash
# Basic usage (convert entire PDF)
python audiobook.py input.pdf

# Specify output file
python audiobook.py input.pdf -o my_audiobook.mp3

# Use Google TTS with female voice
python audiobook.py input.pdf --engine gtts --lang en

# Use offline engine with custom speed
python audiobook.py input.pdf --engine pyttsx3 --rate 160 --voice female

# Split by chapters
python audiobook.py input.pdf --split-chapters

# Convert specific page range
python audiobook.py input.pdf --pages 10-50

# Use OCR for scanned PDFs
python audiobook.py scanned_book.pdf --ocr --ocr-lang eng

# Preview extracted text without converting
python audiobook.py input.pdf --preview

# List available voices
python audiobook.py --list-voices
```

## System Dependencies

### FFmpeg (required for pydub)

- **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html), add to PATH
- **macOS**: `brew install ffmpeg`
- **Ubuntu**: `sudo apt-get install ffmpeg`

### Tesseract OCR (optional, for scanned PDFs)

- **Windows**: [Tesseract installer](https://github.com/UB-Mannheim/tesseract/wiki)
- **macOS**: `brew install tesseract poppler`
- **Ubuntu**: `sudo apt-get install tesseract-ocr poppler-utils`

## Project Structure

```
PDF-to-Audio/
├── audiobook.py          # CLI entry point
├── gui.py                # GUI interface
├── modules/
│   ├── pdf_extractor.py  # PDF text extraction + OCR
│   ├── text_cleaner.py   # Text preprocessing
│   ├── chapter_detector.py
│   ├── tts_converter.py  # pyttsx3, gTTS, edge-tts
│   ├── audio_processor.py
│   └── utils.py
├── output/               # Generated audiobooks
├── requirements.txt
└── README.md
```

## Output Structure

```
output/
└── Book_Name/
    ├── Chapter_01_Introduction.mp3
    ├── Chapter_02_...mp3
    ├── metadata.json
    └── transcript.txt
```

## License

MIT
