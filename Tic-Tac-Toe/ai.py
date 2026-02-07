"""AI opponents for Tic Tac Toe."""

import random


class EasyAI:
    """Easy AI — makes random moves."""

    def __init__(self, symbol='O'):
        self.symbol = symbol
        self.name = "Easy AI 🤖"

    def get_move(self, game):
        """Return a random available position."""
        available = game.get_available_moves()
        return random.choice(available)


class MediumAI:
    """Medium AI — uses basic strategy with some randomness."""

    CORNERS = [1, 3, 7, 9]
    CENTER = 5
    EDGES = [2, 4, 6, 8]

    def __init__(self, symbol='O'):
        self.symbol = symbol
        self.opponent = 'X' if symbol == 'O' else 'O'
        self.name = "Medium AI 🤖"

    def get_move(self, game):
        """Return the best move using basic strategy."""
        available = game.get_available_moves()

        # 1. Win if possible
        for move in available:
            game.board[move] = self.symbol
            if game.check_win(self.symbol):
                game.board[move] = ' '
                return move
            game.board[move] = ' '

        # 2. Block opponent from winning
        for move in available:
            game.board[move] = self.opponent
            if game.check_win(self.opponent):
                game.board[move] = ' '
                return move
            game.board[move] = ' '

        # 3. Take center
        if self.CENTER in available:
            return self.CENTER

        # 4. Take a corner
        available_corners = [c for c in self.CORNERS if c in available]
        if available_corners:
            return random.choice(available_corners)

        # 5. Take an edge
        available_edges = [e for e in self.EDGES if e in available]
        if available_edges:
            return random.choice(available_edges)

        # 6. Random (shouldn't reach here)
        return random.choice(available)


class HardAI:
    """
    Hard AI — uses the Minimax algorithm.
    This AI is UNBEATABLE. The best you can do is draw.
    """

    def __init__(self, symbol='O'):
        self.symbol = symbol
        self.opponent = 'X' if symbol == 'O' else 'O'
        self.name = "Hard AI 🤖 (Unbeatable)"

    def get_move(self, game):
        """Return the optimal move using Minimax."""
        available = game.get_available_moves()

        # If board is empty, take a corner (optimization)
        if len(available) == 9:
            return random.choice([1, 3, 7, 9])

        best_score = float('-inf')
        best_move = None

        for move in available:
            # Try the move
            game.board[move] = self.symbol
            game.move_count += 1

            # Evaluate with Minimax
            score = self._minimax(game, depth=0, is_maximizing=False)

            # Undo the move
            game.board[move] = ' '
            game.move_count -= 1

            if score > best_score:
                best_score = score
                best_move = move

        return best_move

    def _minimax(self, game, depth, is_maximizing):
        """
        Minimax algorithm to find the optimal move.

        Scores:
        - AI wins:    +10 - depth  (prefer faster wins)
        - Opponent wins: -10 + depth  (prefer slower losses)
        - Draw:       0
        """
        if game.check_win(self.symbol):
            return 10 - depth
        if game.check_win(self.opponent):
            return -10 + depth
        if game.move_count == 9:
            return 0

        available = game.get_available_moves()

        if is_maximizing:
            best_score = float('-inf')
            for move in available:
                game.board[move] = self.symbol
                game.move_count += 1

                score = self._minimax(game, depth + 1, False)

                game.board[move] = ' '
                game.move_count -= 1

                best_score = max(score, best_score)
            return best_score

        else:
            best_score = float('inf')
            for move in available:
                game.board[move] = self.opponent
                game.move_count += 1

                score = self._minimax(game, depth + 1, True)

                game.board[move] = ' '
                game.move_count -= 1

                best_score = min(score, best_score)
            return best_score


class ImpossibleAI:
    """
    Impossible AI — Minimax with Alpha-Beta Pruning.
    Same result as Hard AI but computationally more efficient.
    """

    def __init__(self, symbol='O'):
        self.symbol = symbol
        self.opponent = 'X' if symbol == 'O' else 'O'
        self.name = "Impossible AI 🤖 (Alpha-Beta)"

    def get_move(self, game):
        """Return the optimal move using Alpha-Beta Pruning."""
        available = game.get_available_moves()

        if len(available) == 9:
            return random.choice([1, 3, 7, 9])

        best_score = float('-inf')
        best_move = None
        alpha = float('-inf')
        beta = float('inf')

        for move in available:
            game.board[move] = self.symbol
            game.move_count += 1

            score = self._minimax_ab(game, 0, False, alpha, beta)

            game.board[move] = ' '
            game.move_count -= 1

            if score > best_score:
                best_score = score
                best_move = move

            alpha = max(alpha, best_score)

        return best_move

    def _minimax_ab(self, game, depth, is_maximizing, alpha, beta):
        """Minimax with Alpha-Beta Pruning."""
        if game.check_win(self.symbol):
            return 10 - depth
        if game.check_win(self.opponent):
            return -10 + depth
        if game.move_count == 9:
            return 0

        available = game.get_available_moves()

        if is_maximizing:
            best_score = float('-inf')
            for move in available:
                game.board[move] = self.symbol
                game.move_count += 1

                score = self._minimax_ab(game, depth + 1, False, alpha, beta)

                game.board[move] = ' '
                game.move_count -= 1

                best_score = max(score, best_score)
                alpha = max(alpha, best_score)

                if alpha >= beta:
                    break  # Beta cutoff — prune

            return best_score
        else:
            best_score = float('inf')
            for move in available:
                game.board[move] = self.opponent
                game.move_count += 1

                score = self._minimax_ab(game, depth + 1, True, alpha, beta)

                game.board[move] = ' '
                game.move_count -= 1

                best_score = min(score, best_score)
                beta = min(beta, best_score)

                if alpha >= beta:
                    break  # Alpha cutoff — prune

            return best_score
