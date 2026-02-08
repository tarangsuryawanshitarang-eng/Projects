"""Settings management for the game."""

import json
import time

from display import clear_screen, colored, Fore, Style

SETTINGS_FILE = "settings.json"

DEFAULT_SETTINGS = {
    "player_x_symbol": "X",
    "player_o_symbol": "O",
    "board_style": "box",
    "show_hints": True,
    "ai_thinking_delay": True,
    "sound_enabled": False,
    "color_theme": "default",
    "auto_save_stats": True,
}


def load_settings():
    """Load settings from file."""
    try:
        with open(SETTINGS_FILE, 'r') as f:
            saved = json.load(f)
            return {**DEFAULT_SETTINGS, **saved}
    except (FileNotFoundError, json.JSONDecodeError):
        return dict(DEFAULT_SETTINGS)


def save_settings(settings):
    """Save settings to file."""
    with open(SETTINGS_FILE, 'w') as f:
        json.dump(settings, f, indent=2)


def display_settings():
    """Display and modify game settings."""
    settings = load_settings()

    while True:
        clear_screen()
        print(colored("\n  ⚙️  SETTINGS", Fore.CYAN + Style.BRIGHT))
        print(colored("  ──────────────────────────────────\n", Fore.CYAN))

        options = [
            ("1", "Player X Symbol", settings["player_x_symbol"]),
            ("2", "Player O Symbol", settings["player_o_symbol"]),
            ("3", "Board Style", settings["board_style"]),
            ("4", "Show Position Hints", "On" if settings["show_hints"] else "Off"),
            ("5", "AI Thinking Delay", "On" if settings["ai_thinking_delay"] else "Off"),
            ("6", "Color Theme", settings["color_theme"]),
            ("7", "Auto-Save Stats", "On" if settings["auto_save_stats"] else "Off"),
            ("8", "Reset to Defaults", ""),
            ("9", "Back to Menu", ""),
        ]

        for num, label, value in options:
            if value:
                print(colored(f"    {num}. {label}: ", Fore.WHITE) +
                      colored(f"{value}", Fore.YELLOW))
            else:
                print(colored(f"    {num}. {label}", Fore.WHITE))

        print()
        choice = input(colored("    Enter option (1-9): ", Fore.YELLOW)).strip()

        if choice == '1':
            sym = input(colored("    Enter symbol for X [X]: ", Fore.CYAN)).strip()
            if sym and len(sym) == 1:
                settings["player_x_symbol"] = sym
        elif choice == '2':
            sym = input(colored("    Enter symbol for O [O]: ", Fore.CYAN)).strip()
            if sym and len(sym) == 1:
                settings["player_o_symbol"] = sym
        elif choice == '3':
            print(colored("    Styles: box, minimal, emoji", Fore.WHITE))
            style = input(colored("    Choose style: ", Fore.CYAN)).strip().lower()
            if style in ("box", "minimal", "emoji"):
                settings["board_style"] = style
        elif choice == '4':
            settings["show_hints"] = not settings["show_hints"]
        elif choice == '5':
            settings["ai_thinking_delay"] = not settings["ai_thinking_delay"]
        elif choice == '6':
            print(colored("    Themes: default, neon, retro, minimal", Fore.WHITE))
            theme = input(colored("    Choose theme: ", Fore.CYAN)).strip().lower()
            if theme in ("default", "neon", "retro", "minimal"):
                settings["color_theme"] = theme
        elif choice == '7':
            settings["auto_save_stats"] = not settings["auto_save_stats"]
        elif choice == '8':
            settings.clear()
            settings.update(DEFAULT_SETTINGS)
            print(colored("    ✅ Settings reset to defaults.", Fore.GREEN))
            time.sleep(1)
        elif choice == '9':
            save_settings(settings)
            break

        save_settings(settings)
