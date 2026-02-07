import os
import time
from colorama import Fore, Style
from generators import (
    generate_password, generate_passphrase, 
    generate_pronounceable, generate_from_pattern, generate_pin
)
from analyzer import PasswordStrengthAnalyzer, check_password_breach
from utils import copy_to_clipboard, PasswordHistory, mask_password

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def run_interactive():
    analyzer = PasswordStrengthAnalyzer()
    history = PasswordHistory()

    while True:
        clear_screen()
        print(Fore.CYAN + """
  ╔═══════════════════════════════════════════╗
  ║                                           ║
  ║     🔐 PASSWORD GENERATOR                 ║
  ║                                           ║
  ╠═══════════════════════════════════════════╣
  ║                                           ║
  ║   1. 🎲 Generate Random Password          ║
  ║   2. 📝 Generate Passphrase               ║
  ║   3. 🗣️  Generate Pronounceable Password   ║
  ║   4. 🔢 Generate PIN                      ║
  ║   5. 📐 Generate from Pattern             ║
  ║   7. 💪 Analyze Password Strength          ║
  ║   8. 🔍 Check Password Breach             ║
  ║   9. 📜 View Password History              ║
  ║   0. 🚪 Exit                              ║
  ║                                           ║
  ╚═══════════════════════════════════════════╝
        """)

        choice = input(Fore.YELLOW + "  Enter choice (0-9): ").strip()

        if choice == '0':
            print(Fore.CYAN + "\n  👋 Stay secure! Goodbye.\n")
            break
        elif choice == '1':
            interactive_random(analyzer, history)
        elif choice == '2':
            interactive_passphrase(analyzer, history)
        elif choice == '3':
            interactive_pronounceable(analyzer, history)
        elif choice == '4':
            interactive_pin(analyzer, history)
        # Add other choices as needed...
        elif choice == '7':
            interactive_analyze(analyzer)
        elif choice == '8':
            interactive_breach_check()
        elif choice == '9':
            history.display()
            input(Fore.YELLOW + "\n  Press Enter to continue...")
        else:
            print(Fore.RED + "  ❌ Invalid choice.")
            time.sleep(1)

def interactive_random(analyzer, history):
    clear_screen()
    print(Fore.CYAN + Style.BRIGHT + "\n  🎲 Random Password Generator")
    print(Fore.CYAN + "  ────────────────────────────\n")

    try:
        length = int(input(Fore.YELLOW + "  Password length [16]: ").strip() or "16")
    except ValueError:
        length = 16

    use_upper = input("    Uppercase (A-Z)? [Y]: ").strip().lower() != 'n'
    use_lower = input("    Lowercase (a-z)? [Y]: ").strip().lower() != 'n'
    use_digits = input("    Digits (0-9)?    [Y]: ").strip().lower() != 'n'
    use_symbols = input("    Symbols (!@#$)?  [Y]: ").strip().lower() != 'n'

    try:
        password = generate_password(
            length=length,
            use_uppercase=use_upper,
            use_lowercase=use_lower,
            use_digits=use_digits,
            use_symbols=use_symbols,
        )
        print(Fore.GREEN + Style.BRIGHT + f"\n  🔑 {password}")
        result = analyzer.analyze(password)
        print(f"\n  {analyzer.get_strength_bar(result['score'])}")
        print(f"  {result['rating_emoji']} {result['rating']}")
        
        action = input(Fore.YELLOW + "\n  (c)opy, (s)ave, (q)uit: ").strip().lower()
        if action == 'c':
            copy_to_clipboard(password)
        elif action == 's':
            label = input("  Label: ").strip() or "Random"
            history.add(password, label=label, mode="random", strength_score=result['score'])
    except Exception as e:
        print(Fore.RED + f"  ❌ Error: {e}")
        time.sleep(2)

def interactive_passphrase(analyzer, history):
    clear_screen()
    print(Fore.CYAN + Style.BRIGHT + "\n  📝 Passphrase Generator")
    print(Fore.CYAN + "  ───────────────────────\n")

    try:
        num_words = int(input(Fore.YELLOW + "  Number of words [4]: ").strip() or "4")
    except ValueError:
        num_words = 4

    separator = input("  Separator [-]: ").strip() or "-"
    
    passphrase = generate_passphrase(num_words=num_words, separator=separator)
    print(Fore.GREEN + Style.BRIGHT + f"\n  🔑 {passphrase}")
    
    action = input(Fore.YELLOW + "\n  (c)opy, (s)ave, (q)uit: ").strip().lower()
    if action == 'c':
        copy_to_clipboard(passphrase)
    elif action == 's':
        history.add(passphrase, label="Passphrase", mode="passphrase")

def interactive_analyze(analyzer):
    clear_screen()
    print(Fore.CYAN + Style.BRIGHT + "\n  💪 Password Strength Analyzer")
    import getpass
    password = getpass.getpass(Fore.YELLOW + "  Enter password (hidden): ")
    if not password: return

    result = analyzer.analyze(password)
    print(Fore.WHITE + f"\n  Password: {mask_password(password)}")
    print(f"  Strength: {analyzer.get_strength_bar(result['score'])}")
    print(f"  Rating:   {result['rating_emoji']} {result['rating']}")
    input(Fore.YELLOW + "\n  Press Enter to continue...")

def interactive_breach_check():
    clear_screen()
    print(Fore.CYAN + Style.BRIGHT + "\n  🔍 Password Breach Checker")
    import getpass
    password = getpass.getpass(Fore.YELLOW + "  Enter password to check (hidden): ")
    if not password: return

    print(Fore.YELLOW + "  ⏳ Checking...")
    result = check_password_breach(password)
    print(f"\n  {result['message']}")
    input(Fore.YELLOW + "\n  Press Enter to continue...")

def interactive_pin(analyzer, history):
    clear_screen()
    print(Fore.CYAN + Style.BRIGHT + "\n  🔢 PIN Generator")
    try:
        length = int(input(Fore.YELLOW + "  Length [4]: ").strip() or "4")
    except ValueError:
        length = 4
    
    pin = generate_pin(length=length)
    print(Fore.GREEN + Style.BRIGHT + f"\n  🔑 {pin}")
    input(Fore.YELLOW + "\n  Press Enter to continue...")
