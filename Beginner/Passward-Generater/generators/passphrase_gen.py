import secrets
from .wordlist import WORD_LIST

def generate_passphrase(
    num_words=4,
    separator="-",
    capitalize=False,
    include_number=False,
    include_symbol=False,
    word_list=None
):
    """
    Generate a passphrase from random dictionary words.
    """
    words = word_list or WORD_LIST

    # Pick random words
    chosen_words = [secrets.choice(words) for _ in range(num_words)]

    # Capitalize
    if capitalize:
        chosen_words = [w.capitalize() for w in chosen_words]

    # Add number to a random word
    if include_number:
        idx = secrets.randbelow(len(chosen_words))
        chosen_words[idx] += str(secrets.randbelow(10))

    # Join with separator
    passphrase = separator.join(chosen_words)

    # Add symbol at the end
    if include_symbol:
        symbols = "!@#$%^&*"
        passphrase += secrets.choice(symbols)

    return passphrase
