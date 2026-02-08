"""Board display functions for the CLI interface."""

import os
import sys

try:
    from colorama import init, Fore, Style
    init(autoreset=True)
    HAS_COLOR = True
except ImportError:
    HAS_COLOR = False
    class Fore:
        RED = GREEN = YELLOW = CYAN = MAGENTA = BLUE = WHITE = RESET = ''
    class Style:
        BRIGHT = RESET_ALL = ''


# Theme definitions
THEMES = {
    "default": {
        "title": Fore.CYAN,
        "border": Fore.WHITE,
        "x": Fore.CYAN,
        "o": Fore.MAGENTA,
        "win": Fore.GREEN,
        "hint": Fore.WHITE + Style.BRIGHT
    },
    "neon": {
        "title": Fore.MAGENTA + Style.BRIGHT,
        "border": Fore.CYAN,
        "x": Fore.GREEN + Style.BRIGHT,
        "o": Fore.YELLOW + Style.BRIGHT,
        "win": Fore.WHITE + Style.BRIGHT,
        "hint": Fore.BLUE
    },
    "retro": {
        "title": Fore.YELLOW,
        "border": Fore.GREEN,
        "x": Fore.RED,
        "o": Fore.BLUE,
        "win": Fore.YELLOW + Style.BRIGHT,
        "hint": Fore.WHITE
    },
    "minimal": {
        "title": Fore.WHITE,
        "border": Fore.WHITE,
        "x": Fore.WHITE + Style.BRIGHT,
        "o": Fore.WHITE,
        "win": Fore.CYAN + Style.BRIGHT,
        "hint": Fore.BLACK + Style.BRIGHT
    }
}


def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')


def colored(text, color):
    """Apply color to text if colorama is available."""
    return f"{color}{text}{Style.RESET_ALL}" if HAS_COLOR else text


def display_board_colored(board, winning_combo=None):
    """Display board with colors and optional winning highlight based on settings."""
    from settings import load_settings
    settings = load_settings()
    
    theme_name = settings.get("color_theme", "default")
    style_name = settings.get("board_style", "box")
    show_hints = settings.get("show_hints", True)
    
    theme = THEMES.get(theme_name, THEMES["default"])
    
    clear_screen()

    print(colored("\n  ╔═══════════════════╗", theme["title"]))
    print(colored("  ║   TIC  TAC  TOE   ║", theme["title"]))
    print(colored("  ╚═══════════════════╝\n", theme["title"]))

    if style_name == "emoji":
        render_emoji_board(board, theme, winning_combo)
    elif style_name == "minimal":
        render_minimal_board(board, theme, winning_combo, show_hints)
    else:
        render_box_board(board, theme, winning_combo, show_hints)

    print()


def render_box_board(board, theme, winning_combo, show_hints):
    """Render the standard box style board."""
    for i in range(3):
        if i == 0:
            print(colored("  ┌─────┬─────┬─────┐", theme["border"]))

        print(colored("  │     │     │     │", theme["border"]))

        cells_str = ""
        for j in range(3):
            pos = i * 3 + j + 1
            value = board[pos]

            if value == ' ':
                cell_val = str(pos) if show_hints else " "
                cell = colored(f' {cell_val} ', theme["hint"])
            elif value == 'X':
                color = theme["win"] if winning_combo and pos in winning_combo else theme["x"]
                cell = colored(' X ', color + Style.BRIGHT)
            elif value == 'O':
                color = theme["win"] if winning_combo and pos in winning_combo else theme["o"]
                cell = colored(' O ', color + Style.BRIGHT)
            else:
                cell = colored(f' {value} ', Fore.WHITE)

            separator = colored("│", theme["border"])
            cells_str += f"{separator}{cell}"

        cells_str += colored("│", theme["border"])
        print(f"  {cells_str}")
        print(colored("  │     │     │     │", theme["border"]))

        if i < 2:
            print(colored("  ├─────┼─────┼─────┤", theme["border"]))
        else:
            print(colored("  └─────┴─────┴─────┘", theme["border"]))


def render_minimal_board(board, theme, winning_combo, show_hints):
    """Render a minimal lines style board."""
    for i in range(3):
        cells = []
        for j in range(3):
            pos = i * 3 + j + 1
            value = board[pos]
            if value == ' ':
                cell_val = str(pos) if show_hints else " "
                cells.append(colored(f' {cell_val} ', theme["hint"]))
            elif value == 'X':
                color = theme["win"] if winning_combo and pos in winning_combo else theme["x"]
                cells.append(colored(' X ', color + Style.BRIGHT))
            elif value == 'O':
                color = theme["win"] if winning_combo and pos in winning_combo else theme["o"]
                cells.append(colored(' O ', color + Style.BRIGHT))
            else:
                cells.append(colored(f' {value} ', Fore.WHITE))

        print(f"    {cells[0]} {colored('│', theme['border'])} {cells[1]} {colored('│', theme['border'])} {cells[2]}")
        if i < 2:
            print(colored("   ─────┼─────┼─────", theme["border"]))


def render_emoji_board(board, theme, winning_combo):
    """Render a board using emojis or icons."""
    # Use different markers for emoji style
    x_marker = "❌"
    o_marker = "⭕"
    empty_markers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"]
    win_marker = "⭐️"

    for i in range(3):
        row_str = "    "
        for j in range(3):
            pos = i * 3 + j + 1
            value = board[pos]

            if value == ' ':
                cell = empty_markers[pos-1]
            elif value == 'X':
                cell = win_marker if winning_combo and pos in winning_combo else x_marker
            elif value == 'O':
                cell = win_marker if winning_combo and pos in winning_combo else o_marker
            
            row_str += cell + "  "
        print(row_str)
        if i < 2:
            print()
