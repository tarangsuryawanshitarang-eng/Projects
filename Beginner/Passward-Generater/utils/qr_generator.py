try:
    import qrcode
    HAS_QR = True
except ImportError:
    HAS_QR = False

def generate_qr_code(password, filename="password_qr.png"):
    """
    Generate a QR code for a password.
    """
    if not HAS_QR:
        print("  ⚠️  qrcode library not installed. Install with: pip install qrcode[pil]")
        return False
    
    try:
        qr = qrcode.make(password)
        qr.save(filename)
        print(f"  📱 QR code saved to: {filename}")
        return True
    except Exception as e:
        print(f"  ❌ Failed to generate QR code: {e}")
        return False
