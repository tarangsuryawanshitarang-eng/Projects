import json
import os
import base64
from datetime import datetime
from .helpers import mask_password

try:
    from cryptography.fernet import Fernet
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    HAS_CRYPTO = True
except ImportError:
    HAS_CRYPTO = False

HISTORY_FILE = "password_history.enc"

class PasswordHistory:
    """Encrypted password history storage."""

    def __init__(self, master_password=None):
        self.master_password = master_password
        self.history = []
        self.cipher = None

        if HAS_CRYPTO and master_password:
            self.cipher = self._create_cipher(master_password)
        
        self.load()

    def _create_cipher(self, master_password):
        salt = b'password_generator_salt_v1'
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=390000,
        )
        key = base64.urlsafe_b64encode(
            kdf.derive(master_password.encode())
        )
        return Fernet(key)

    def add(self, password, label="", mode="random", strength_score=0):
        entry = {
            "password": password,
            "label": label,
            "mode": mode,
            "strength": strength_score,
            "timestamp": str(datetime.now()),
            "length": len(password),
        }
        self.history.append(entry)
        self.save()

    def save(self):
        data = json.dumps(self.history)
        if self.cipher:
            encrypted = self.cipher.encrypt(data.encode())
            with open(HISTORY_FILE, 'wb') as f:
                f.write(encrypted)
        else:
            with open(HISTORY_FILE + ".json", 'w') as f:
                f.write(data)

    def load(self):
        try:
            if self.cipher and os.path.exists(HISTORY_FILE):
                with open(HISTORY_FILE, 'rb') as f:
                    encrypted = f.read()
                decrypted = self.cipher.decrypt(encrypted)
                self.history = json.loads(decrypted)
            elif os.path.exists(HISTORY_FILE + ".json"):
                with open(HISTORY_FILE + ".json", 'r') as f:
                    self.history = json.loads(f.read())
        except Exception:
            self.history = []

    def display(self, show_passwords=False):
        if not self.history:
            print("  📭 No password history.")
            return

        print(f"\n  {'#':<4} {'Label':<20} {'Mode':<14} {'Length':<8} {'Strength':<10} {'Date':<20}")
        print(f"  {'─'*4} {'─'*20} {'─'*14} {'─'*8} {'─'*10} {'─'*20}")

        for i, entry in enumerate(self.history):
            label = entry.get('label', 'Untitled')[:20]
            mode = entry.get('mode', 'unknown')[:14]
            length = entry.get('length', '?')
            strength = entry.get('strength', 0)
            timestamp = entry.get('timestamp', '')[:19]

            strength_bar = "█" * (strength // 20) + "░" * (5 - strength // 20)
            print(f"  {i:<4} {label:<20} {mode:<14} {length:<8} {strength_bar:<10} {timestamp:<20}")

            if show_passwords:
                pwd = entry.get('password', '')
                print(f"       Password: {pwd}")
            else:
                pwd = mask_password(entry.get('password', ''))
                print(f"       Password: {pwd}")

        print(f"\n  Total: {len(self.history)} passwords")
