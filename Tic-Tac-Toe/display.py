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


def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')


def colored(text, color):
    """Apply color to text if colorama is available."""
    return f"{color}{text}{Style.RESET_ALL}" if HAS_COLOR else text


def display_board(board):
    """Display the Tic Tac Toe board with formatting (basic, no colors)."""
    clear_screen()
    print("\n  ╔═══════════════════╗")
    print("  ║   TIC  TAC  TOE   ║")
    print("  ╚═══════════════════╝\n")

    for i in range(3):
        if i == 0:
            print("  ┌─────┬─────┬─────┐")
        print("  │     │     │     │")

        cells = []
        for j in range(3):
            pos = i * 3 + j + 1
            value = board[pos]
            if value == ' ':
                cells.append(f' {pos} ')
            elif value == 'X':
                cells.append(' X ')
            elif value == 'O':
                cells.append(' O ')
            else:
                cells.append(f' {value} ')

        print(f"  │{cells[0]}│{cells[1]}│{cells[2]}│")
        print("  │     │     │     │")

        if i < 2:
            print("  ├─────┼─────┼─────┤")
        else:
            print("  └─────┴─────┴─────┘")

    print()


def display_board_colored(board, winning_combo=None):
    """Display board with colors and optional winning highlight."""
    clear_screen()

    print(colored("\n  ╔═══════════════════╗", Fore.CYAN))
    print(colored("  ║   TIC  TAC  TOE   ║", Fore.CYAN))
    print(colored("  ╚═══════════════════╝\n", Fore.CYAN))

    for i in range(3):
        if i == 0:
            print(colored("  ┌─────┬─────┬─────┐", Fore.WHITE))

        print(colored("  │     │     │     │", Fore.WHITE))

        cells_str = ""
        for j in range(3):
            pos = i * 3 + j + 1
            value = board[pos]

            if value == ' ':
                cell = colored(f' {pos} ', Fore.WHITE + Style.BRIGHT)
            elif value == 'X':
                if winning_combo and pos in winning_combo:
                    cell = colored(' X ', Fore.GREEN + Style.BRIGHT)
                else:
                    cell = colored(' X ', Fore.CYAN + Style.BRIGHT)
            elif value == 'O':
                if winning_combo and pos in winning_combo:
                    cell = colored(' O ', Fore.GREEN + Style.BRIGHT)
                else:
                    cell = colored(' O ', Fore.MAGENTA + Style.BRIGHT)
            else:
                cell = colored(f' {value} ', Fore.WHITE)

            separator = colored("│", Fore.WHITE)
            cells_str += f"{separator}{cell}"

        cells_str += colored("│", Fore.WHITE)
        print(f"  {cells_str}")
        print(colored("  │     │     │     │", Fore.WHITE))

        if i < 2:
            print(colored("  ├─────┼─────┼─────┤", Fore.WHITE))
        else:
            print(colored("  └─────┴─────┴─────┘", Fore.WHITE))

    print()
