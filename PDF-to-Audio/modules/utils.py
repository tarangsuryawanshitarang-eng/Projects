"""
Utility functions for PDF to AudioBook Converter.
"""

import json
import os
import re
from datetime import datetime
from typing import List, Optional, Tuple

BOOKMARK_FILE = "conversion_progress.json"


def split_text_into_chunks(text: str, max_chars: int = 5000) -> List[str]:
    """
    Split text into chunks at sentence boundaries for TTS APIs with length limits.
    
    Args:
        text: Full text to split
        max_chars: Maximum characters per chunk
    
    Returns:
        List of text chunks
    """
    if not text or len(text) <= max_chars:
        return [text.strip()] if text and text.strip() else []

    # Replace newlines with spaces for splitting
    text = text.replace('\n', ' ').replace('\r', ' ')
    
    # Split by sentences (rough heuristic)
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks = []
    current_chunk = ""

    for sentence in sentences:
        if len(current_chunk) + len(sentence) + 1 <= max_chars:
            current_chunk += sentence + " "
        else:
            if current_chunk.strip():
                chunks.append(current_chunk.strip())
            # If single sentence exceeds limit, split by words
            if len(sentence) > max_chars:
                words = sentence.split()
                current_chunk = ""
                for word in words:
                    if len(current_chunk) + len(word) + 1 <= max_chars:
                        current_chunk += word + " "
                    else:
                        if current_chunk.strip():
                            chunks.append(current_chunk.strip())
                        current_chunk = word + " "
            else:
                current_chunk = sentence + " "

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks


def parse_page_range(page_str: str, total_pages: int) -> Optional[Tuple[int, int]]:
    """
    Parse page range string like "1-50", "5,10,15-20", "10-" into (start, end) tuple.
    
    For complex ranges like "5,10,15-20", returns the min and max.
    
    Args:
        page_str: Page range string
        total_pages: Total pages in document
    
    Returns:
        (start, end) tuple (1-indexed, inclusive) or None
    """
    if not page_str:
        return None

    page_str = page_str.strip()
    pages = []

    # Handle "1-50" or "10-"
    if '-' in page_str:
        parts = page_str.split('-', 1)
        start = int(parts[0].strip()) if parts[0].strip().isdigit() else 1
        end = int(parts[1].strip()) if len(parts) > 1 and parts[1].strip().isdigit() else total_pages
        return (max(1, start), min(total_pages, end))

    # Handle "5,10,15"
    if ',' in page_str:
        for part in page_str.split(','):
            part = part.strip()
            if '-' in part:
                sub_start, sub_end = part.split('-', 1)
                pages.extend(range(
                    max(1, int(sub_start.strip())),
                    min(total_pages, int(sub_end.strip())) + 1
                ))
            elif part.isdigit():
                pages.append(int(part))
        if pages:
            return (min(pages), max(pages))

    # Single page
    if page_str.isdigit():
        p = int(page_str)
        return (p, p)

    return None


def save_progress(
    pdf_path: str,
    current_chapter: int,
    total_chapters: int,
    completed_files: List[str]
) -> None:
    """Save conversion progress for resume capability."""
    progress = {
        "pdf_path": pdf_path,
        "current_chapter": current_chapter,
        "total_chapters": total_chapters,
        "completed_files": completed_files,
        "timestamp": str(datetime.now())
    }
    with open(BOOKMARK_FILE, 'w') as f:
        json.dump(progress, f, indent=2)


def load_progress() -> Optional[dict]:
    """Load previously saved progress."""
    if os.path.exists(BOOKMARK_FILE):
        try:
            with open(BOOKMARK_FILE, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            pass
    return None


def sanitize_filename(name: str, max_length: int = 50) -> str:
    """Create safe filename from chapter title."""
    safe = re.sub(r'[^\w\s-]', '', name)
    safe = re.sub(r'[\s_]+', '_', safe).strip('_')
    return safe[:max_length] if len(safe) > max_length else safe or "chapter"
