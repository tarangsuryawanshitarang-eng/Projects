import secrets
import string

def generate_password(
    length=16,
    use_uppercase=True,
    use_lowercase=True,
    use_digits=True,
    use_symbols=True,
    exclude_ambiguous=False,
    exclude_chars="",
    must_include_each=True
):
    """
    Generate a cryptographically secure random password.
    """
    # ── Build character pool ──
    char_pool = ""
    required_chars = []   # Ensure at least one from each category

    if use_lowercase:
        chars = string.ascii_lowercase
        char_pool += chars
        if must_include_each:
            required_chars.append(chars)

    if use_uppercase:
        chars = string.ascii_uppercase
        char_pool += chars
        if must_include_each:
            required_chars.append(chars)

    if use_digits:
        chars = string.digits
        char_pool += chars
        if must_include_each:
            required_chars.append(chars)

    if use_symbols:
        chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
        char_pool += chars
        if must_include_each:
            required_chars.append(chars)

    # ── Validate ──
    if not char_pool:
        raise ValueError("At least one character type must be selected.")

    if must_include_each and length < len(required_chars):
        raise ValueError(
            f"Password length ({length}) must be at least "
            f"{len(required_chars)} to include each character type."
        )

    # ── Remove excluded characters ──
    if exclude_ambiguous:
        ambiguous = "Il1O0oS5Z2"
        char_pool = ''.join(c for c in char_pool if c not in ambiguous)
        required_chars = [
            ''.join(c for c in cat if c not in ambiguous)
            for cat in required_chars
        ]

    if exclude_chars:
        char_pool = ''.join(c for c in char_pool if c not in exclude_chars)
        required_chars = [
            ''.join(c for c in cat if c not in exclude_chars)
            for cat in required_chars
        ]

    # ── Validate pool not empty after exclusions ──
    if not char_pool:
        raise ValueError("Character pool is empty after exclusions.")

    # Filter out empty required categories
    required_chars = [cat for cat in required_chars if cat]

    # ── Generate password ──
    if must_include_each and required_chars:
        # Step 1: Pick one character from each required category
        password_chars = [secrets.choice(cat) for cat in required_chars]

        # Step 2: Fill remaining length with random chars from full pool
        remaining = length - len(password_chars)
        password_chars += [secrets.choice(char_pool) for _ in range(remaining)]

        # Step 3: Shuffle to avoid predictable positions
        password_list = list(password_chars)
        for i in range(len(password_list) - 1, 0, -1):
            j = secrets.randbelow(i + 1)
            password_list[i], password_list[j] = password_list[j], password_list[i]

        return ''.join(password_list)
    else:
        # Simple random generation
        return ''.join(secrets.choice(char_pool) for _ in range(length))
