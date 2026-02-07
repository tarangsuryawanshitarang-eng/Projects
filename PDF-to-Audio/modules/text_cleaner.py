"""
Text Cleaning & Preprocessing Module (Phase 2)
Cleans raw PDF text for optimal TTS conversion.
"""

import re
from typing import Dict


# Abbreviations to expand for natural speech
ABBREVIATIONS: Dict[str, str] = {
    'Dr.': 'Doctor',
    'Mr.': 'Mister',
    'Mrs.': 'Missus',
    'Ms.': 'Miss',
    'Prof.': 'Professor',
    'Sr.': 'Senior',
    'Jr.': 'Junior',
    'e.g.': 'for example',
    'i.e.': 'that is',
    'etc.': 'etcetera',
    'vs.': 'versus',
    'approx.': 'approximately',
    'Fig.': 'Figure',
    'Figs.': 'Figures',
    'vol.': 'volume',
    'no.': 'number',
    'St.': 'Street',
    'Ave.': 'Avenue',
    'Dept.': 'Department',
    'Gov.': 'Governor',
    'Inc.': 'Incorporated',
    'Ltd.': 'Limited',
}


def clean_text(raw_text: str) -> str:
    """
    Clean extracted text for TTS conversion.
    
    Handles:
    - Hyphenated line breaks
    - Page numbers and headers/footers
    - Excessive whitespace
    - Abbreviation expansion
    - URL removal
    - Special characters
    - Table of contents references
    - Figure/table placeholders
    
    Args:
        raw_text: Raw text extracted from PDF
    
    Returns:
        Cleaned text suitable for TTS
    """
    if not raw_text:
        return ""

    text = raw_text

    # 1. Fix hyphenated line breaks (e.g., "con-\ntinue" -> "continue")
    text = re.sub(r'(\w+)-\s*\n\s*(\w+)', r'\1\2', text)

    # 2. Remove page numbers (various formats)
    text = re.sub(r'\n\s*\d+\s*\n', '\n', text)
    text = re.sub(r'\n\s*-\s*\d+\s*-\s*\n', '\n', text)
    text = re.sub(r'Page\s+\d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE)

    # 3. Remove excessive whitespace and blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r'[ \t]{2,}', ' ', text)

    # 4. Expand abbreviations (order matters - do longer matches first)
    # Sort by length descending to avoid partial matches
    for abbr, full in sorted(ABBREVIATIONS.items(), key=lambda x: -len(x[0])):
        # Use word boundary to avoid replacing inside words
        text = re.sub(r'\b' + re.escape(abbr) + r'\b', full, text)

    # 5. Remove URLs (replace with placeholder or remove)
    text = re.sub(r'https?://[^\s]+', 'link removed', text)
    text = re.sub(r'www\.\S+', 'link removed', text)

    # 6. Remove special characters (keep basic punctuation)
    text = re.sub(r'[^\w\s.,;:!?\'\"()\-–—]', ' ', text)

    # 7. Remove table of contents dotted lines and page refs
    text = re.sub(r'\.{3,}\s*\d+', '', text)
    text = re.sub(r'\s+\.{3,}\s+', ' ', text)

    # 8. Remove figure/table placeholders
    text = re.sub(r'\[Figure\s+\d+[^\]]*\]', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\[Table\s+\d+[^\]]*\]', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\[Image[^\]]*\]', '', text, flags=re.IGNORECASE)

    # 9. Normalize em/en dashes
    text = text.replace('–', '-').replace('—', '-')

    # 10. Remove standalone numbers that are likely page refs
    text = re.sub(r'\n\s*\d{1,3}\s*\n', '\n', text)

    # 11. Final cleanup
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    text = text.strip()

    return text
