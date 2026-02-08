"""
Chapter Detection Module (Phase 5)
Detects chapter/section boundaries in extracted text.
"""

import re
from typing import List, Dict


def detect_chapters(text: str) -> List[Dict]:
    """
    Detect chapter boundaries in the text.
    
    Common patterns: "Chapter 1", "Part 2", "Section 3", "1. Introduction"
    
    Args:
        text: Full document text
    
    Returns:
        List of chapter dicts with 'title', 'content', 'index'
    """
    if not text or not text.strip():
        return [{"title": "Full Book", "content": text or "", "index": 1}]

    # Common chapter heading patterns
    chapter_patterns = [
        r'(?i)^chapter\s+\d+',           # "Chapter 1", "CHAPTER 12"
        r'(?i)^chapter\s+[IVXLCDM]+',    # "Chapter IV" (Roman numerals)
        r'(?i)^part\s+\d+',              # "Part 1"
        r'(?i)^part\s+[IVXLCDM]+',
        r'(?i)^section\s+\d+',           # "Section 3"
        r'(?i)^book\s+\d+',              # "Book 2"
        r'^\d+\.\s+[A-Z]',               # "1. Introduction"
        r'^[IVXLCDM]+\.\s+[A-Z]',        # "IV. Analysis"
        r'(?i)^prologue\s*$',
        r'(?i)^epilogue\s*$',
        r'(?i)^preface\s*$',
        r'(?i)^introduction\s*$',
        r'(?i)^appendix\s+[A-Z]',
    ]

    combined_pattern = '|'.join(f'({p})' for p in chapter_patterns)

    chapters = []
    lines = text.split('\n')
    current_chapter = {"title": "Introduction", "content": "", "index": 0}
    chapter_count = 0

    for line in lines:
        stripped = line.strip()
        if stripped and re.match(combined_pattern, stripped):
            # Save previous chapter if it has content
            if current_chapter["content"].strip():
                chapters.append(current_chapter)

            chapter_count += 1
            current_chapter = {
                "title": stripped,
                "content": "",
                "index": chapter_count
            }
        else:
            current_chapter["content"] += line + "\n"

    # Don't forget the last chapter
    if current_chapter["content"].strip():
        chapters.append(current_chapter)

    # If no chapters detected, treat entire text as one chapter
    if not chapters:
        chapters = [{"title": "Full Book", "content": text, "index": 1}]

    return chapters
