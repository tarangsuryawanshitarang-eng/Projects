import time
import threading

try:
    import pyperclip
    HAS_CLIPBOARD = True
except ImportError:
    HAS_CLIPBOARD = False

def copy_to_clipboard(text, auto_clear=True, clear_after=30):
    """
    Copy text to clipboard with auto-clear functionality.
    """
    if not HAS_CLIPBOARD:
        print("  ⚠️  pyperclip not installed. Install with: pip install pyperclip")
        return False

    try:
        pyperclip.copy(text)
        print("  📋 Copied to clipboard!")

        if auto_clear:
            def clear_clipboard():
                time.sleep(clear_after)
                try:
                    current = pyperclip.paste()
                    if current == text:
                        pyperclip.copy("")
                except:
                    pass

            thread = threading.Thread(target=clear_clipboard, daemon=True)
            thread.start()

        return True

    except Exception as e:
        print(f"  ❌ Failed to copy: {e}")
        return False
