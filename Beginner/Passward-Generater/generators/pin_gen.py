import secrets

def generate_pin(length=4, no_repeated=False, no_sequential=False):
    """
    Generate a random PIN.
    """
    max_attempts = 1000
    attempts = 0

    while attempts < max_attempts:
        pin = ''.join(str(secrets.randbelow(10)) for _ in range(length))
        attempts += 1

        # Check for repeated digits
        if no_repeated:
            has_repeated = False
            for i in range(len(pin) - 2):
                if pin[i] == pin[i+1] == pin[i+2]:
                    has_repeated = True
                    break
            if has_repeated:
                continue

        # Check for sequential digits
        if no_sequential:
            has_sequential = False
            for i in range(len(pin) - 2):
                if (int(pin[i+1]) == int(pin[i]) + 1 and
                    int(pin[i+2]) == int(pin[i]) + 2):
                    has_sequential = True
                    break
                if (int(pin[i+1]) == int(pin[i]) - 1 and
                    int(pin[i+2]) == int(pin[i]) - 2):
                    has_sequential = True
                    break
            if has_sequential:
                continue

        return pin

    # Fallback
    return ''.join(str(secrets.randbelow(10)) for _ in range(length))
