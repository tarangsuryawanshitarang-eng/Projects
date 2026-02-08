import math
import re
from .common_passwords import COMMON_PASSWORDS, KEYBOARD_PATTERNS

class PasswordStrengthAnalyzer:
    """Analyze and score password strength."""

    def analyze(self, password):
        """
        Analyze a password and return a detailed strength report.
        """
        if not password:
            return {
                "score": 0,
                "rating": "No Password",
                "rating_emoji": "❌",
                "entropy": 0,
                "crack_time": "Instant",
                "feedback": ["Enter a password to analyze."],
                "details": {}
            }

        score = 0
        feedback = []
        details = {}

        length = len(password)
        has_lower = bool(re.search(r'[a-z]', password))
        has_upper = bool(re.search(r'[A-Z]', password))
        has_digit = bool(re.search(r'\d', password))
        has_symbol = bool(re.search(r'[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`\\\'"]', password))
        unique_chars = len(set(password))

        details["length"] = length
        details["has_lowercase"] = has_lower
        details["has_uppercase"] = has_upper
        details["has_digits"] = has_digit
        details["has_symbols"] = has_symbol
        details["unique_characters"] = unique_chars

        # ── Length scoring ──
        if length >= 8:
            score += 10
        elif length >= 6:
            score += 5
        else:
            feedback.append("⚠️  Too short — use at least 8 characters")

        if length >= 12:
            score += 10
        if length >= 16:
            score += 10
        if length >= 20:
            score += 5

        # ── Character variety ──
        char_types = sum([has_lower, has_upper, has_digit, has_symbol])
        score += char_types * 10

        if not has_lower:
            feedback.append("💡 Add lowercase letters (a-z)")
        if not has_upper:
            feedback.append("💡 Add uppercase letters (A-Z)")
        if not has_digit:
            feedback.append("💡 Add digits (0-9)")
        if not has_symbol:
            feedback.append("💡 Add symbols (!@#$%^&*)")

        # ── Uniqueness ──
        uniqueness_ratio = unique_chars / length if length > 0 else 0
        if uniqueness_ratio > 0.7:
            score += 10
        elif uniqueness_ratio < 0.4:
            score -= 5
            feedback.append("⚠️  Too many repeated characters")

        details["uniqueness_ratio"] = round(uniqueness_ratio, 2)

        # ── Pattern detection ──
        if password.lower() in COMMON_PASSWORDS:
            score -= 30
            feedback.append("🚨 This is a very common password!")

        lower_pass = password.lower()
        for pattern in KEYBOARD_PATTERNS:
            if pattern in lower_pass:
                score -= 10
                feedback.append(f"⚠️  Contains keyboard pattern: '{pattern}'")
                break

        sequential = 0
        for i in range(len(password) - 2):
            if (ord(password[i+1]) == ord(password[i]) + 1 and
                ord(password[i+2]) == ord(password[i]) + 2):
                sequential += 1
        if sequential > 0:
            score -= sequential * 5
            feedback.append("⚠️  Contains sequential characters")

        repeated = 0
        for i in range(len(password) - 2):
            if password[i] == password[i+1] == password[i+2]:
                repeated += 1
        if repeated > 0:
            score -= repeated * 5
            feedback.append("⚠️  Contains repeated characters (e.g., 'aaa')")

        # ── Calculate entropy ──
        pool_size = 0
        if has_lower: pool_size += 26
        if has_upper: pool_size += 26
        if has_digit: pool_size += 10
        if has_symbol: pool_size += 33

        if pool_size > 0 and length > 0:
            entropy = math.log2(pool_size) * length
        else:
            entropy = 0

        details["entropy_bits"] = round(entropy, 1)
        details["pool_size"] = pool_size

        if entropy >= 128:
            score += 10
        elif entropy >= 80:
            score += 5
        elif entropy < 36:
            score -= 5

        crack_time = self._estimate_crack_time(entropy)
        details["crack_time"] = crack_time

        score = max(0, min(100, score))

        if score >= 80:
            rating = "Very Strong"
            rating_emoji = "💪"
        elif score >= 60:
            rating = "Strong"
            rating_emoji = "🟢"
        elif score >= 40:
            rating = "Fair"
            rating_emoji = "🟡"
        elif score >= 20:
            rating = "Weak"
            rating_emoji = "🟠"
        else:
            rating = "Very Weak"
            rating_emoji = "🔴"

        if not feedback:
            feedback.append("✅ Great password!")

        return {
            "score": score,
            "rating": rating,
            "rating_emoji": rating_emoji,
            "entropy": round(entropy, 1),
            "crack_time": crack_time,
            "feedback": feedback,
            "details": details
        }

    def _estimate_crack_time(self, entropy):
        guesses_per_second = 10_000_000_000
        total_combinations = 2 ** entropy
        seconds = total_combinations / guesses_per_second

        if seconds < 1:
            return "Instant"
        elif seconds < 60:
            return f"{seconds:.0f} seconds"
        elif seconds < 3600:
            return f"{seconds/60:.0f} minutes"
        elif seconds < 86400:
            return f"{seconds/3600:.0f} hours"
        elif seconds < 31536000:
            return f"{seconds/86400:.0f} days"
        elif seconds < 31536000 * 100:
            return f"{seconds/31536000:.0f} years"
        else:
            exponent = math.log10(seconds / 31536000)
            return f"10^{exponent:.0f} years"

    def get_strength_bar(self, score, width=20):
        filled = int(score / 100 * width)
        empty = width - filled
        color_char = "█"
        empty_char = "░"
        return f"[{color_char * filled}{empty_char * empty}] {score}%"
