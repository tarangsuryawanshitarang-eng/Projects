import hashlib
import requests

def check_password_breach(password):
    """
    Check if a password has been found in data breaches.
    Uses the Have I Been Pwned API with k-anonymity.
    """
    sha1_hash = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    prefix = sha1_hash[:5]
    suffix = sha1_hash[5:]

    try:
        url = f"https://api.pwnedpasswords.com/range/{prefix}"
        response = requests.get(url, timeout=5)

        if response.status_code != 200:
            return {
                "breached": None,
                "count": 0,
                "message": f"⚠️  API error (status {response.status_code})"
            }

        for line in response.text.splitlines():
            hash_suffix, count = line.split(':')
            if hash_suffix == suffix:
                count = int(count)
                return {
                    "breached": True,
                    "count": count,
                    "message": f"🚨 Found in {count:,} data breaches!"
                }

        return {
            "breached": False,
            "count": 0,
            "message": "✅ Not found in any known data breaches."
        }

    except requests.ConnectionError:
        return {
            "breached": None,
            "count": 0,
            "message": "⚠️  No internet connection. Could not check breaches."
        }
    except Exception as e:
        return {
            "breached": None,
            "count": 0,
            "message": f"⚠️  Error checking breach: {e}"
        }
