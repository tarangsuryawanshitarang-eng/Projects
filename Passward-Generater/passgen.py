import argparse
import sys
import os
import time
from colorama import init, Fore, Style
from generators import (
    generate_password, generate_passphrase, 
    generate_pronounceable, generate_from_pattern, generate_pin
)
from analyzer import PasswordStrengthAnalyzer, check_password_breach
from utils import (
    copy_to_clipboard, PasswordHistory, export_passwords, 
    generate_qr_code, mask_password
)

# Initialize colorama
init(autoreset=True)

def create_parser():
    parser = argparse.ArgumentParser(
        description="🔐 Secure Password Generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python passgen.py                            # Default 16-char password
  python passgen.py -l 24                      # 24-character password
  python passgen.py --mode passphrase -w 5     # 5-word passphrase
  python passgen.py --mode pronounceable       # Pronounceable password
  python passgen.py --mode pin -l 6            # 6-digit PIN
  python passgen.py --mode pattern -p "Llll-dddd"  # Pattern-based
  python passgen.py -n 10 --export bulk.csv    # Generate & export 10
  python passgen.py --analyze "MyPassword1!"   # Analyze strength
  python passgen.py --check-breach "password"  # Check data breaches
  python passgen.py --interactive              # Interactive mode
        """
    )

    # ── Generation mode ──
    parser.add_argument(
        '--mode', '-m',
        choices=['random', 'passphrase', 'pronounceable', 'pin', 'pattern'],
        default='random',
        help='Password generation mode (default: random)'
    )

    # ── Length / Count ──
    parser.add_argument(
        '--length', '-l',
        type=int, default=16,
        help='Password length (default: 16)'
    )
    parser.add_argument(
        '--count', '-n',
        type=int, default=1,
        help='Number of passwords to generate (default: 1)'
    )

    # ── Character options ──
    parser.add_argument('--no-uppercase', action='store_true', help='Exclude uppercase letters')
    parser.add_argument('--no-lowercase', action='store_true', help='Exclude lowercase letters')
    parser.add_argument('--no-digits', action='store_true', help='Exclude digits')
    parser.add_argument('--no-symbols', action='store_true', help='Exclude symbols')
    parser.add_argument('--no-ambiguous', action='store_true', help='Exclude ambiguous characters (I,l,1,O,0)')
    parser.add_argument('--exclude', type=str, default='', help='Specific characters to exclude')
    parser.add_argument('--digits-only', action='store_true', help='Generate digits only (like a PIN)')

    # ── Passphrase options ──
    parser.add_argument('--words', '-w', type=int, default=4, help='Number of words in passphrase')
    parser.add_argument('--separator', '-s', type=str, default='-', help='Passphrase word separator')
    parser.add_argument('--capitalize', action='store_true', help='Capitalize passphrase words')
    parser.add_argument('--add-number', action='store_true', help='Add number to passphrase')
    parser.add_argument('--add-symbol', action='store_true', help='Add symbol to passphrase')

    # ── Pattern options ──
    parser.add_argument('--pattern', '-p', type=str, help='Pattern for pattern-based generation')

    # ── Analysis ──
    parser.add_argument('--analyze', '-a', type=str, help='Analyze strength of a given password')
    parser.add_argument('--check-breach', type=str, help='Check if password is in known breaches')
    parser.add_argument('--verbose', '-v', action='store_true', help='Show detailed strength analysis')

    # ── Output ──
    parser.add_argument('--copy', '-c', action='store_true', help='Copy password to clipboard')
    parser.add_argument('--no-auto-clear', action='store_true', help='Don\'t auto-clear clipboard')
    parser.add_argument('--export', type=str, help='Export passwords to file')
    parser.add_argument('--format', choices=['txt', 'csv', 'json'], default='txt', help='Export format')
    parser.add_argument('--qr', action='store_true', help='Generate QR code for password')

    # ── History ──
    parser.add_argument('--history', action='store_true', help='Show password history')
    parser.add_argument('--save', action='store_true', help='Save password to history')
    parser.add_argument('--label', type=str, default='', help='Label for saved password')

    # ── Modes ──
    parser.add_argument('--interactive', '-i', action='store_true', help='Run in interactive mode')

    return parser

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def interactive_mode():
    from interactive import run_interactive
    run_interactive()

def cli_main():
    parser = create_parser()
    args = parser.parse_args()
    analyzer = PasswordStrengthAnalyzer()

    if args.interactive:
        interactive_mode()
        return

    if args.history:
        history = PasswordHistory()
        history.display()
        return

    if args.analyze:
        result = analyzer.analyze(args.analyze)
        print(f"\n  Password: {mask_password(args.analyze)}")
        print(f"  Strength: {analyzer.get_strength_bar(result['score'])}")
        print(f"  Rating: {result['rating_emoji']} {result['rating']}")
        print(f"  Entropy: {result['entropy']} bits")
        print(f"  Crack time: {result['crack_time']}")
        for tip in result['feedback']:
            print(f"    {tip}")
        return

    if args.check_breach:
        result = check_password_breach(args.check_breach)
        print(f"\n  Password: {mask_password(args.check_breach)}")
        print(f"  {result['message']}\n")
        return

    passwords = []
    for _ in range(args.count):
        if args.mode == 'random' or args.digits_only:
            pwd = generate_password(
                length=args.length,
                use_uppercase=not args.no_uppercase and not args.digits_only,
                use_lowercase=not args.no_lowercase and not args.digits_only,
                use_digits=not args.no_digits,
                use_symbols=not args.no_symbols and not args.digits_only,
                exclude_ambiguous=args.no_ambiguous,
                exclude_chars=args.exclude,
            )
        elif args.mode == 'passphrase':
            pwd = generate_passphrase(
                num_words=args.words,
                separator=args.separator,
                capitalize=args.capitalize,
                include_number=args.add_number,
                include_symbol=args.add_symbol,
            )
        elif args.mode == 'pronounceable':
            pwd = generate_pronounceable(length=args.length)
        elif args.mode == 'pin':
            pwd = generate_pin(length=args.length)
        elif args.mode == 'pattern':
            if not args.pattern:
                print(Fore.RED + "  ❌ --pattern is required for pattern mode.")
                return
            pwd = generate_from_pattern(args.pattern)
        passwords.append(pwd)

    print(Fore.CYAN + Style.BRIGHT + "\n  🔐 Generated Password(s):")
    print(Fore.CYAN + "  ─────────────────────────────\n")

    for i, pwd in enumerate(passwords):
        if args.count > 1:
            print(Fore.WHITE + f"  {i+1:>3}. " + Fore.GREEN + Style.BRIGHT + pwd)
        else:
            print(Fore.GREEN + Style.BRIGHT + f"  {pwd}")

        if args.verbose:
            result = analyzer.analyze(pwd)
            bar = analyzer.get_strength_bar(result['score'])
            print(Fore.WHITE + f"       Strength: {bar}")
            print(Fore.WHITE + f"       Entropy:  {result['entropy']} bits")
            print(Fore.WHITE + f"       Crack:    {result['crack_time']}")
            print()

    if args.copy and len(passwords) == 1:
        copy_to_clipboard(passwords[0], auto_clear=not args.no_auto_clear)

    if args.save:
        history = PasswordHistory()
        for pwd in passwords:
            result = analyzer.analyze(pwd)
            history.add(pwd, label=args.label, mode=args.mode, strength_score=result['score'])
        print(Fore.GREEN + f"\n  💾 Saved {len(passwords)} password(s) to history.")

    if args.export:
        export_passwords(passwords, args.export, format=args.format)

    if args.qr and len(passwords) == 1:
        generate_qr_code(passwords[0])

    print()

if __name__ == "__main__":
    cli_main()
