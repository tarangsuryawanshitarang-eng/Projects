"""Core Tic Tac Toe game logic."""


class TicTacToe:
    """Core Tic Tac Toe game logic."""

    # All possible winning combinations
    WIN_COMBINATIONS = [
        # Rows
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        # Columns
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        # Diagonals
        [1, 5, 9],
        [3, 5, 7],
    ]

    def __init__(self):
        """Initialize a new game."""
        self.board = {i: ' ' for i in range(1, 10)}
        self.current_player = 'X'   # X always goes first
        self.move_history = []       # List of (position, player) tuples
        self.game_over = False
        self.winner = None
        self.move_count = 0

    def reset(self):
        """Reset the game to initial state."""
        self.__init__()

    def get_available_moves(self):
        """Return list of available (empty) positions."""
        return [pos for pos, val in self.board.items() if val == ' ']

    def is_valid_move(self, position):
        """Check if a move is valid."""
        if not isinstance(position, int):
            return False
        if position < 1 or position > 9:
            return False
        if self.board[position] != ' ':
            return False
        if self.game_over:
            return False
        return True

    def make_move(self, position):
        """
        Place the current player's mark at the given position.
        Returns True if move was successful, False otherwise.
        """
        if not self.is_valid_move(position):
            return False

        self.board[position] = self.current_player
        self.move_history.append((position, self.current_player))
        self.move_count += 1

        # Check for win or draw
        if self.check_win(self.current_player):
            self.game_over = True
            self.winner = self.current_player
        elif self.check_draw():
            self.game_over = True
            self.winner = None  # Draw

        # Switch player
        if not self.game_over:
            self.current_player = 'O' if self.current_player == 'X' else 'X'

        return True

    def undo_move(self):
        """Undo the last move. Returns True if successful."""
        if not self.move_history:
            return False

        position, player = self.move_history.pop()
        self.board[position] = ' '
        self.move_count -= 1
        self.current_player = player
        self.game_over = False
        self.winner = None
        return True

    def check_win(self, player):
        """Check if the given player has won."""
        for combo in self.WIN_COMBINATIONS:
            if all(self.board[pos] == player for pos in combo):
                return True
        return False

    def get_winning_combo(self, player):
        """Return the winning combination if player has won, else None."""
        for combo in self.WIN_COMBINATIONS:
            if all(self.board[pos] == player for pos in combo):
                return combo
        return None

    def check_draw(self):
        """Check if the game is a draw (board full, no winner)."""
        return (self.move_count == 9 and
                not self.check_win('X') and not self.check_win('O'))

    def get_board_copy(self):
        """Return a deep copy of the current board."""
        return dict(self.board)

    def display(self):
        """Display the current board state."""
        from display import display_board_colored
        display_board_colored(self.board)

    def __str__(self):
        """String representation of the board."""
        rows = []
        for i in range(3):
            row = []
            for j in range(3):
                pos = i * 3 + j + 1
                val = self.board[pos]
                row.append(val if val != ' ' else str(pos))
            rows.append(' | '.join(row))
        return '\n-----------\n'.join(rows)
