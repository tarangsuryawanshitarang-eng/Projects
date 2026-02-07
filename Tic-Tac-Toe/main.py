"""Main entry point for the Tic Tac Toe game."""

import sys
import time
import random

from game import TicTacToe
from display import clear_screen, display_board_colored, colored, Fore, Style
from ai import EasyAI, MediumAI, HardAI, ImpossibleAI
from scores import ScoreTracker
from settings import display_settings, load_settings


def get_player_move(game, player_name):
    """Get and validate a move from a human player."""
    while True:
        try:
            prompt = colored(
                f"  {player_name}'s turn ({game.current_player}). "
                f"Enter position (1-9): ",
                Fore.YELLOW
            )
            move = input(prompt).strip()

            # Handle special commands
            if move.lower() == 'q':
                print(colored("\n  👋 Thanks for playing! Goodbye.\n", Fore.CYAN))
                sys.exit(0)
            elif move.lower() == 'u':
                # Undo up to 2 moves (both players in PvP)
                count = 0
                while game.undo_move() and count < 2:
                    count += 1
                if count > 0:
                    print(colored("  ↩️  Move undone!", Fore.YELLOW))
                    time.sleep(0.5)
                    return None
                else:
                    print(colored("  ❌ Cannot undo further.", Fore.RED))
                    continue
            elif move.lower() == 'h':
                print(colored("\n  Commands:", Fore.CYAN))
                print(colored("    1-9 : Place your mark", Fore.WHITE))
                print(colored("    u   : Undo last move", Fore.WHITE))
                print(colored("    q   : Quit game", Fore.WHITE))
                print(colored("    h   : Show help\n", Fore.WHITE))
                continue

            position = int(move)

            if not game.is_valid_move(position):
                if position < 1 or position > 9:
                    print(colored("  ❌ Please enter a number between 1 and 9.", Fore.RED))
                else:
                    print(colored("  ❌ That position is already taken!", Fore.RED))
                continue

            return position

        except ValueError:
            print(colored("  ❌ Invalid input. Enter a number (1-9) or 'h' for help.", Fore.RED))


def play_pvp(score_tracker):
    """Play a Player vs Player game."""
    game = TicTacToe()
    settings = load_settings()
    auto_save = settings.get("auto_save_stats", True)

    print(colored("\n  👥 Player vs Player Mode", Fore.GREEN + Style.BRIGHT))
    print(colored("  ─────────────────────────\n", Fore.GREEN))

    name = input(colored("  Player 1 (X) name [Player 1]: ", Fore.CYAN)).strip()
    player_names = {'X': name if name else "Player 1"}

    name = input(colored("  Player 2 (O) name [Player 2]: ", Fore.MAGENTA)).strip()
    player_names['O'] = name if name else "Player 2"

    while True:
        game.reset()
        display_board_colored(game.board)

        while not game.game_over:
            current_name = player_names[game.current_player]
            move = get_player_move(game, current_name)

            if move is None:
                display_board_colored(game.board)
                continue

            game.make_move(move)

            if game.game_over and game.winner:
                winning_combo = game.get_winning_combo(game.winner)
                display_board_colored(game.board, winning_combo)
            else:
                display_board_colored(game.board)

        # Record game for stats
        if auto_save and score_tracker:
            score_tracker.record_game(
                player_names['X'], player_names['O'],
                game.winner, game.move_count, "PvP"
            )

        if game.winner:
            winner_name = player_names[game.winner]
            print(colored(f"  🎉 {winner_name} ({game.winner}) WINS! 🎉",
                         Fore.GREEN + Style.BRIGHT))
        else:
            print(colored("  🤝 It's a DRAW!", Fore.YELLOW + Style.BRIGHT))

        print(colored(f"  📊 Total moves: {game.move_count}", Fore.WHITE))

        print()
        again = input(colored("  Play again? (y/n): ", Fore.CYAN)).strip().lower()
        if again != 'y':
            print(colored("\n  👋 Thanks for playing! Goodbye.\n", Fore.CYAN))
            break


def play_pvai(score_tracker):
    """Play a Player vs AI game."""
    game = TicTacToe()
    settings = load_settings()
    auto_save = settings.get("auto_save_stats", True)
    ai_delay = settings.get("ai_thinking_delay", True)

    print(colored("\n  🤖 Player vs AI Mode", Fore.GREEN + Style.BRIGHT))
    print(colored("  ────────────────────────\n", Fore.GREEN))

    name = input(colored("  Your name [Player]: ", Fore.CYAN)).strip()
    player_name = name if name else "Player"

    print(colored(f"\n  Choose your symbol:", Fore.YELLOW))
    print(colored("    1. ✕ (X) — Goes first", Fore.CYAN))
    print(colored("    2. ○ (O) — Goes second", Fore.MAGENTA))

    while True:
        choice = input(colored("\n  Enter choice (1/2) [1]: ", Fore.YELLOW)).strip()
        if choice in ('', '1'):
            player_symbol = 'X'
            ai_symbol = 'O'
            break
        elif choice == '2':
            player_symbol = 'O'
            ai_symbol = 'X'
            break
        print(colored("  ❌ Invalid choice.", Fore.RED))

    print(colored(f"\n  Select AI difficulty:", Fore.YELLOW))
    print(colored("    1. 🟢 Easy    — Random moves", Fore.GREEN))
    print(colored("    2. 🟡 Medium  — Basic strategy", Fore.YELLOW))
    print(colored("    3. 🔴 Hard    — Minimax (Unbeatable)", Fore.RED))
    print(colored("    4. 🟣 Impossible — Alpha-Beta (Unbeatable+)", Fore.MAGENTA))

    while True:
        diff = input(colored("\n  Enter difficulty (1-4) [2]: ", Fore.YELLOW)).strip()
        if diff in ('', '2'):
            ai = MediumAI(ai_symbol)
            break
        elif diff == '1':
            ai = EasyAI(ai_symbol)
            break
        elif diff == '3':
            ai = HardAI(ai_symbol)
            break
        elif diff == '4':
            ai = ImpossibleAI(ai_symbol)
            break
        print(colored("  ❌ Invalid choice.", Fore.RED))

    print(colored(f"\n  You: {player_symbol} | AI: {ai_symbol} ({ai.name})", Fore.WHITE))
    print(colored("  Type 'h' for help during the game.\n", Fore.WHITE))
    time.sleep(1)

    while True:
        game.reset()
        display_board_colored(game.board)

        while not game.game_over:
            if game.current_player == player_symbol:
                move = get_player_move(game, player_name)
                if move is None:
                    display_board_colored(game.board)
                    continue
                game.make_move(move)
            else:
                print(colored(f"  🤖 {ai.name} is thinking...", Fore.YELLOW))
                if ai_delay:
                    time.sleep(random.uniform(0.3, 1.0))

                move = ai.get_move(game)
                game.make_move(move)

                print(colored(f"  🤖 AI plays position {move}", Fore.YELLOW))
                time.sleep(0.3)

            if game.game_over and game.winner:
                winning_combo = game.get_winning_combo(game.winner)
                display_board_colored(game.board, winning_combo)
            else:
                display_board_colored(game.board)

        # Record game for stats
        if auto_save and score_tracker:
            ai_name = ai.name
            score_tracker.record_game(
                player_name, ai_name,
                game.winner, game.move_count, "PvAI"
            )

        if game.winner == player_symbol:
            print(colored(f"  🎉 Congratulations, {player_name}! You WIN! 🎉",
                         Fore.GREEN + Style.BRIGHT))
            if diff in ('3', '4'):
                print(colored("  (Wait... that shouldn't be possible! 🤔)",
                             Fore.YELLOW))
        elif game.winner == ai_symbol:
            print(colored(f"  🤖 {ai.name} WINS! Better luck next time.",
                         Fore.RED + Style.BRIGHT))
        else:
            print(colored("  🤝 It's a DRAW! Well played.",
                         Fore.YELLOW + Style.BRIGHT))

        print(colored(f"  📊 Total moves: {game.move_count}", Fore.WHITE))
        print()

        again = input(colored("  Play again? (y/n): ", Fore.CYAN)).strip().lower()
        if again != 'y':
            print(colored("\n  👋 Thanks for playing! Goodbye.\n", Fore.CYAN))
            break


def play_ai_vs_ai():
    """Watch two AIs play against each other."""
    game = TicTacToe()

    print(colored("\n  👁️  AI vs AI — Watch Mode", Fore.GREEN + Style.BRIGHT))
    print(colored("  ──────────────────────────\n", Fore.GREEN))

    print(colored("  Select AI for X:", Fore.CYAN))
    print(colored("    1. 🟢 Easy", Fore.GREEN))
    print(colored("    2. 🟡 Medium", Fore.YELLOW))
    print(colored("    3. 🔴 Hard", Fore.RED))
    print(colored("    4. 🟣 Impossible", Fore.MAGENTA))
    ai_x_choice = input(colored("\n  Choice [3]: ", Fore.YELLOW)).strip()

    print(colored("\n  Select AI for O:", Fore.MAGENTA))
    print(colored("    1. 🟢 Easy", Fore.GREEN))
    print(colored("    2. 🟡 Medium", Fore.YELLOW))
    print(colored("    3. 🔴 Hard", Fore.RED))
    print(colored("    4. 🟣 Impossible", Fore.MAGENTA))
    ai_o_choice = input(colored("\n  Choice [3]: ", Fore.YELLOW)).strip()

    ai_map = {
        '1': lambda s: EasyAI(s),
        '2': lambda s: MediumAI(s),
        '3': lambda s: HardAI(s),
        '4': lambda s: ImpossibleAI(s),
        '': lambda s: HardAI(s),
    }

    ai_x = ai_map.get(ai_x_choice, lambda s: HardAI(s))('X')
    ai_o = ai_map.get(ai_o_choice, lambda s: HardAI(s))('O')

    print(colored(f"\n  X: {ai_x.name}  vs  O: {ai_o.name}", Fore.WHITE))
    print(colored("  Watch the AIs battle it out!\n", Fore.YELLOW))
    time.sleep(1.5)

    display_board_colored(game.board)

    while not game.game_over:
        current_ai = ai_x if game.current_player == 'X' else ai_o

        print(colored(f"  🤖 {current_ai.name} ({game.current_player}) thinking...",
                     Fore.YELLOW))
        time.sleep(0.8)

        move = current_ai.get_move(game)
        game.make_move(move)

        print(colored(f"  ➡️  Plays position {move}", Fore.WHITE))
        time.sleep(0.3)

        if game.game_over and game.winner:
            winning_combo = game.get_winning_combo(game.winner)
            display_board_colored(game.board, winning_combo)
        else:
            display_board_colored(game.board)

    if game.winner:
        winner_ai = ai_x if game.winner == 'X' else ai_o
        print(colored(f"  🎉 {winner_ai.name} ({game.winner}) WINS!",
                     Fore.GREEN + Style.BRIGHT))
    else:
        print(colored("  🤝 It's a DRAW!", Fore.YELLOW + Style.BRIGHT))

    print(colored(f"  📊 Total moves: {game.move_count}\n", Fore.WHITE))
    input(colored("  Press Enter to return to menu...", Fore.YELLOW))


def display_title():
    """Display the game title."""
    clear_screen()
    title = """
    ╔═══════════════════════════════════════════╗
    ║                                           ║
    ║     ████████╗██╗ ██████╗                  ║
    ║     ╚══██╔══╝██║██╔════╝                  ║
    ║        ██║   ██║██║                       ║
    ║        ██║   ██║██║                       ║
    ║        ██║   ██║╚██████╗                  ║
    ║        ╚═╝   ╚═╝ ╚═════╝                  ║
    ║                                           ║
    ║     ████████╗ █████╗  ██████╗             ║
    ║     ╚══██╔══╝██╔══██╗██╔════╝             ║
    ║        ██║   ███████║██║                  ║
    ║        ██║   ██╔══██║██║                  ║
    ║        ██║   ██║  ██║╚██████╗             ║
    ║        ╚═╝   ╚═╝  ╚═╝ ╚═════╝             ║
    ║                                           ║
    ║     ████████╗ ██████╗ ███████╗            ║
    ║     ╚══██╔══╝██╔═══██╗██╔════╝            ║
    ║        ██║   ██║   ██║█████╗              ║
    ║        ██║   ██║   ██║██╔══╝              ║
    ║        ██║   ╚██████╔╝███████╗            ║
    ║        ╚═╝    ╚═════╝ ╚══════╝            ║
    ║                                           ║
    ╚═══════════════════════════════════════════╝
    """
    print(colored(title, Fore.CYAN))


def display_menu():
    """Display the main menu."""
    print(colored("    ┌─────────────────────────────────┐", Fore.WHITE))
    print(colored("    │                                 │", Fore.WHITE))
    print(colored("    │  1. 👥  Player vs Player        │", Fore.WHITE))
    print(colored("    │  2. 🤖  Player vs AI            │", Fore.WHITE))
    print(colored("    │  3. 👁️   AI vs AI (Watch)        │", Fore.WHITE))
    print(colored("    │  4. 🏆  Leaderboard             │", Fore.WHITE))
    print(colored("    │  5. 📊  My Statistics           │", Fore.WHITE))
    print(colored("    │  6. 📖  How to Play             │", Fore.WHITE))
    print(colored("    │  7. ⚙️   Settings                 │", Fore.WHITE))
    print(colored("    │  8. 🚪  Exit                    │", Fore.WHITE))
    print(colored("    │                                 │", Fore.WHITE))
    print(colored("    └─────────────────────────────────┘\n", Fore.WHITE))


def display_how_to_play():
    """Display game instructions."""
    clear_screen()
    print(colored("""
    ╔═══════════════════════════════════════════╗
    ║           📖  HOW TO PLAY                 ║
    ╠═══════════════════════════════════════════╣
    ║                                           ║
    ║  The board has 9 positions numbered 1-9:  ║
    ║                                           ║
    ║       7 │ 8 │ 9                           ║
    ║      ───┼───┼───                          ║
    ║       4 │ 5 │ 6                           ║
    ║      ───┼───┼───                          ║
    ║       1 │ 2 │ 3                           ║
    ║                                           ║
    ║  • Players take turns placing X or O      ║
    ║  • Enter the position number (1-9)        ║
    ║  • First to get 3 in a row wins!          ║
    ║  • Rows, columns, or diagonals count      ║
    ║                                           ║
    ║  Commands during game:                    ║
    ║  • 1-9 : Place your mark                  ║
    ║  • u   : Undo last move                   ║
    ║  • h   : Show help                        ║
    ║  • q   : Quit to menu                     ║
    ║                                           ║
    ╚═══════════════════════════════════════════╝
    """, Fore.CYAN))
    input(colored("    Press Enter to return to menu...", Fore.YELLOW))


def main():
    """Main application entry point."""
    score_tracker = ScoreTracker()

    while True:
        display_title()
        display_menu()

        choice = input(colored("    Enter choice (1-8): ", Fore.YELLOW)).strip()

        if choice == '1':
            play_pvp(score_tracker)
        elif choice == '2':
            play_pvai(score_tracker)
        elif choice == '3':
            play_ai_vs_ai()
        elif choice == '4':
            score_tracker.display_leaderboard()
            input(colored("\n  Press Enter to continue...", Fore.YELLOW))
        elif choice == '5':
            name = input(colored("\n  Enter player name: ", Fore.CYAN)).strip()
            if name:
                score_tracker.display_player_stats(name)
            input(colored("  Press Enter to continue...", Fore.YELLOW))
        elif choice == '6':
            display_how_to_play()
        elif choice == '7':
            display_settings()
        elif choice == '8':
            print(colored("\n    👋 Thanks for playing Tic Tac Toe!", Fore.CYAN))
            print(colored("    See you next time! 🎮\n", Fore.CYAN))
            break
        else:
            print(colored("\n    ❌ Invalid choice. Please try again.", Fore.RED))
            time.sleep(1)


if __name__ == "__main__":
    main()
