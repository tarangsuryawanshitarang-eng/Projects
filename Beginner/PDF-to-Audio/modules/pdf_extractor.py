"""
PDF Text Extraction Module (Phase 1 + 6)
Extracts text from text-based PDFs and uses OCR for scanned PDFs.
"""

try:
    from pypdf import PdfReader
except ImportError:
    from PyPDF2 import PdfReader  # Fallback for older installations
from typing import Optional


def extract_text_from_pdf(
    pdf_path: str,
    page_range: Optional[tuple] = None,
    verbose: bool = False
) -> Optional[str]:
    """
    Extract text from a text-based PDF file.
    
    Args:
        pdf_path: Path to the PDF file
        page_range: Optional (start, end) tuple for page range (1-indexed)
        verbose: Print progress messages
    
    Returns:
        Extracted text or None on error
    """
    try:
        with open(pdf_path, 'rb') as file:
            reader = PdfReader(file)

            # Check if PDF is encrypted
            if reader.is_encrypted:
                try:
                    reader.decrypt('')  # Try empty password
                except Exception:
                    if verbose:
                        print("Error: PDF is password-protected.")
                    return None

            text = ""
            total_pages = len(reader.pages)
            
            # Handle page range (1-indexed, inclusive)
            if page_range:
                start, end = page_range
                start = max(1, min(start, total_pages))
                end = max(start, min(end, total_pages))
                pages_to_process = range(start - 1, end)
            else:
                pages_to_process = range(total_pages)

            for i in pages_to_process:
                page = reader.pages[i]
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
                if verbose:
                    print(f"Extracted page {i + 1}/{total_pages}")

            return text if text.strip() else None

    except FileNotFoundError:
        if verbose:
            print(f"Error: File '{pdf_path}' not found.")
        return None
    except Exception as e:
        if verbose:
            print(f"Error reading PDF: {e}")
        return None


def is_scanned_pdf(pdf_path: str, sample_pages: int = 3) -> bool:
    """
    Check if a PDF is scanned (image-based) or text-based.
    
    Args:
        pdf_path: Path to the PDF file
        sample_pages: Number of pages to check
    
    Returns:
        True if PDF appears to be scanned, False if text-based
    """
    try:
        with open(pdf_path, 'rb') as file:
            reader = PdfReader(file)
            text_found = False

            pages_to_check = min(sample_pages, len(reader.pages))
            for i in range(pages_to_check):
                page_text = reader.pages[i].extract_text()
                if page_text and len(page_text.strip()) > 50:
                    text_found = True
                    break

            return not text_found
    except Exception:
        return True  # Assume scanned if we can't read it


def extract_text_with_ocr(
    pdf_path: str,
    language: str = 'eng',
    page_range: Optional[tuple] = None,
    verbose: bool = False
) -> Optional[str]:
    """
    Extract text from scanned PDF using OCR.
    
    Args:
        pdf_path: Path to the PDF file
        language: Tesseract language code (e.g., 'eng', 'eng+fra')
        page_range: Optional (start, end) tuple for page range
        verbose: Print progress messages
    
    Returns:
        Extracted text or None on error
    """
    try:
        from pdf2image import convert_from_path
        import pytesseract
        from PIL import Image, ImageEnhance
    except ImportError as e:
        if verbose:
            print(f"OCR dependencies not installed: {e}")
            print("Install with: pip install pytesseract Pillow pdf2image")
            print("Also install Tesseract: https://github.com/UB-Mannheim/tesseract/wiki")
        return None

    if verbose:
        print("Scanned PDF detected. Using OCR...")

    try:
        images = convert_from_path(pdf_path, dpi=300)
        full_text = ""
        
        total_pages = len(images)
        start_idx = 0
        end_idx = total_pages
        
        if page_range:
            start, end = page_range
            start_idx = max(0, start - 1)
            end_idx = min(total_pages, end)

        for i in range(start_idx, end_idx):
            image = images[i]
            if verbose:
                print(f"OCR processing page {i + 1}/{total_pages}...")

            processed_image = _preprocess_image_for_ocr(image)
            page_text = pytesseract.image_to_string(
                processed_image,
                lang=language,
                config='--psm 6'
            )
            full_text += page_text + "\n"

        return full_text.strip() or None

    except Exception as e:
        if verbose:
            print(f"OCR Error: {e}")
        return None


def _preprocess_image_for_ocr(image) -> 'Image.Image':
    """Pre-process image to improve OCR accuracy."""
    from PIL import ImageEnhance

    # Convert to grayscale
    image = image.convert('L')

    # Increase contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2.0)

    # Increase sharpness
    enhancer = ImageEnhance.Sharpness(image)
    image = enhancer.enhance(2.0)

    # Apply threshold (binarize)
    image = image.point(lambda x: 0 if x < 140 else 255, '1')

    return image


def smart_extract(
    pdf_path: str,
    force_ocr: bool = False,
    ocr_language: str = 'eng',
    page_range: Optional[tuple] = None,
    verbose: bool = False
) -> Optional[str]:
    """
    Automatically choose the best extraction method.
    Uses OCR if PDF is scanned or force_ocr is True.
    
    Args:
        pdf_path: Path to the PDF file
        force_ocr: Force OCR even for text-based PDFs
        ocr_language: Tesseract language for OCR
        page_range: Optional (start, end) page range
        verbose: Print progress messages
    
    Returns:
        Extracted text or None
    """
    if force_ocr:
        return extract_text_with_ocr(
            pdf_path, ocr_language, page_range, verbose
        )

    text = extract_text_from_pdf(pdf_path, page_range, verbose)

    if not text or len(text.strip()) < 50:
        if is_scanned_pdf(pdf_path):
            return extract_text_with_ocr(
                pdf_path, ocr_language, page_range, verbose
            )

    return text
