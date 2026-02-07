"""Score tracking and game statistics."""

import json
from datetime import datetime

from display import colored, Fore, Style

STATS_FILE = "game_stats.json"


class ScoreTracker:
    """Track and persist game statistics."""

    def __init__(self):
        self.stats = self.load_stats()

    def load_stats(self):
        """Load stats from JSON file."""
        try:
            with open(STATS_FILE, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {
                "players": {},
                "games": [],
                "total_games": 0,
            }

    def save_stats(self):
        """Save stats to JSON file."""
        with open(STATS_FILE, 'w') as f:
            json.dump(self.stats, f, indent=2)

    def get_player_stats(self, player_name):
        """Get or create stats for a player."""
        if player_name not in self.stats["players"]:
            self.stats["players"][player_name] = {
                "wins": 0,
                "losses": 0,
                "draws": 0,
                "total_games": 0,
                "win_streak": 0,
                "best_streak": 0,
                "created_at": str(datetime.now()),
            }
        return self.stats["players"][player_name]

    def record_game(self, player1, player2, winner, moves, mode):
        """Record a completed game."""
        self.stats["total_games"] += 1

        game_record = {
            "id": self.stats["total_games"],
            "player1": player1,
            "player2": player2,
            "winner": winner,
            "moves": moves,
            "mode": mode,
            "timestamp": str(datetime.now()),
        }
        self.stats["games"].append(game_record)

        # Update player stats
        if winner:
            winner_stats = self.get_player_stats(winner)
            winner_stats["wins"] += 1
            winner_stats["total_games"] += 1
            winner_stats["win_streak"] += 1
            winner_stats["best_streak"] = max(
                winner_stats["best_streak"],
                winner_stats["win_streak"]
            )

            loser = player1 if winner == player2 else player2
            loser_stats = self.get_player_stats(loser)
            loser_stats["losses"] += 1
            loser_stats["total_games"] += 1
            loser_stats["win_streak"] = 0
        else:
            # Draw
            for player in [player1, player2]:
                p_stats = self.get_player_stats(player)
                p_stats["draws"] += 1
                p_stats["total_games"] += 1
                p_stats["win_streak"] = 0

        self.save_stats()

    def display_leaderboard(self):
        """Display the leaderboard."""
        print(colored("\n  ╔══════════════════════════════════════════╗", Fore.CYAN))
        print(colored("  ║           🏆  LEADERBOARD  🏆            ║", Fore.CYAN))
        print(colored("  ╠══════════════════════════════════════════╣", Fore.CYAN))

        if not self.stats["players"]:
            print(colored("  ║  No games played yet!                    ║", Fore.WHITE))
            print(colored("  ╚══════════════════════════════════════════╝\n", Fore.CYAN))
            return

        # Sort by wins
        sorted_players = sorted(
            self.stats["players"].items(),
            key=lambda x: x[1]["wins"],
            reverse=True
        )

        print(colored("  ║ Rank │ Player         │ W  │ L  │ D  │ %  ║", Fore.YELLOW))
        print(colored("  ╟──────┼────────────────┼────┼────┼────┼────╢", Fore.WHITE))

        medals = ['🥇', '🥈', '🥉']
        for i, (name, stats) in enumerate(sorted_players):
            medal = medals[i] if i < 3 else f' {i+1}'
            total = stats["total_games"]
            win_pct = (stats["wins"] / total * 100) if total > 0 else 0

            print(colored(
                f"  ║ {medal}  │ {name:<14} │ {stats['wins']:<2} │ "
                f"{stats['losses']:<2} │ {stats['draws']:<2} │ {win_pct:>3.0f}║",
                Fore.WHITE
            ))

        print(colored("  ╚══════════════════════════════════════════╝\n", Fore.CYAN))
        print(colored(f"  📊 Total games played: {self.stats['total_games']}", Fore.WHITE))

    def display_player_stats(self, player_name):
        """Display detailed stats for a specific player."""
        stats = self.get_player_stats(player_name)
        total = stats["total_games"]
        win_pct = (stats["wins"] / total * 100) if total > 0 else 0

        print(colored(f"\n  📊 Stats for {player_name}:", Fore.CYAN + Style.BRIGHT))
        print(colored("  ─────────────────────────", Fore.CYAN))
        print(colored(f"  🏆 Wins:        {stats['wins']}", Fore.GREEN))
        print(colored(f"  ❌ Losses:      {stats['losses']}", Fore.RED))
        print(colored(f"  🤝 Draws:       {stats['draws']}", Fore.YELLOW))
        print(colored(f"  📈 Win Rate:    {win_pct:.1f}%", Fore.WHITE))
        print(colored(f"  🔥 Current Streak: {stats['win_streak']}", Fore.MAGENTA))
        print(colored(f"  ⭐ Best Streak:    {stats['best_streak']}", Fore.MAGENTA))
        print(colored(f"  🎮 Total Games:    {total}", Fore.WHITE))
        print()
