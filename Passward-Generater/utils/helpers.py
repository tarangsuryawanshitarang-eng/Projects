import math
import re

def mask_password(password, show_chars=4):
    """
    Mask a password for display.
    """
    if len(password) <= show_chars:
        return password[0] + "*" * (len(password) - 1)
    return password[:show_chars] + "*" * (len(password) - show_chars)

def calculate_entropy(password):
    """Calculate password entropy in bits."""
    pool = 0
    if re.search(r'[a-z]', password): pool += 26
    if re.search(r'[A-Z]', password): pool += 26
    if re.search(r'\d', password): pool += 10
    if re.search(r'[^a-zA-Z0-9]', password): pool += 33

    if pool == 0:
        return 0

    return round(math.log2(pool) * len(password), 1)
