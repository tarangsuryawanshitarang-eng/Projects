import secrets

def generate_pronounceable(length=12, capitalize_random=True):
    """
    Generate a pronounceable (but random) password.
    """
    consonants = "bcdfghjklmnpqrstvwxyz"
    vowels = "aeiou"

    # Syllable patterns: CV (consonant-vowel), CVC, VC
    password_chars = []

    while len(password_chars) < length - 2:  # Leave room for number + symbol
        # Consonant
        password_chars.append(secrets.choice(consonants))
        # Vowel
        password_chars.append(secrets.choice(vowels))

        # Optionally add another consonant (CVC pattern)
        if secrets.randbelow(3) == 0 and len(password_chars) < length - 2:
            password_chars.append(secrets.choice(consonants))

    # Randomly capitalize some letters
    if capitalize_random:
        for i in range(len(password_chars)):
            if secrets.randbelow(4) == 0:  # 25% chance
                password_chars[i] = password_chars[i].upper()

    # Always capitalize first letter
    if password_chars:
        password_chars[0] = password_chars[0].upper()

    # Add a digit and symbol for strength
    password_chars.append(str(secrets.randbelow(10)))
    password_chars.append(secrets.choice("!@#$%&*"))

    return ''.join(password_chars[:length])
