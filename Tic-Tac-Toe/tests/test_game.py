import unittest
from game import TicTacToe

class TestTicTacToe(unittest.TestCase):

    def setUp(self):
        """Set up a fresh game for each test."""
        self.game = TicTacToe()

    def test_initial_board_is_empty(self):
        """Board should start with all empty cells."""
        for pos in range(1, 10):
            self.assertEqual(self.game.board[pos], ' ')

    def test_initial_player_is_x(self):
        """First player should be X."""
        self.assertEqual(self.game.current_player, 'X')

    def test_valid_move(self):
        """Valid move should be accepted."""
        self.assertTrue(self.game.make_move(5))
        self.assertEqual(self.game.board[5], 'X')

    def test_invalid_move_occupied(self):
        """Move to occupied cell should be rejected."""
        self.game.make_move(5)
        self.assertFalse(self.game.make_move(5))

    def test_invalid_move_out_of_range(self):
        """Move outside 1-9 should be rejected."""
        self.assertFalse(self.game.is_valid_move(0))
        self.assertFalse(self.game.is_valid_move(10))
        self.assertFalse(self.game.is_valid_move(-1))

    def test_player_switches_after_move(self):
        """Current player should switch after each move."""
        self.game.make_move(1)
        self.assertEqual(self.game.current_player, 'O')
        self.game.make_move(2)
        self.assertEqual(self.game.current_player, 'X')

    def test_row_win(self):
        """Three in a row should be a win."""
        self.game.make_move(1) # X
        self.game.make_move(4) # O
        self.game.make_move(2) # X
        self.game.make_move(5) # O
        self.game.make_move(3) # X
        self.assertTrue(self.game.game_over)
        self.assertEqual(self.game.winner, 'X')

    def test_column_win(self):
        """Three in a column should be a win."""
        self.game.make_move(1) # X
        self.game.make_move(2) # O
        self.game.make_move(4) # X
        self.game.make_move(5) # O
        self.game.make_move(7) # X
        self.assertTrue(self.game.game_over)
        self.assertEqual(self.game.winner, 'X')

    def test_diagonal_win(self):
        """Three in a diagonal should be a win."""
        self.game.make_move(1) # X
        self.game.make_move(2) # O
        self.game.make_move(5) # X
        self.game.make_move(3) # O
        self.game.make_move(9) # X
        self.assertTrue(self.game.game_over)
        self.assertEqual(self.game.winner, 'X')

    def test_draw(self):
        """Full board with no winner should be a draw."""
        # X O X
        # X X O
        # O X O
        draw_moves = [1, 2, 3, 5, 4, 7, 8, 9, 6]
        for pos in draw_moves:
            self.game.make_move(pos)
        self.assertTrue(self.game.game_over)
        self.assertIsNone(self.game.winner)

    def test_undo_move(self):
        """Undo should restore previous state."""
        self.game.make_move(5)
        self.game.undo_move()
        self.assertEqual(self.game.board[5], ' ')
        self.assertEqual(self.game.current_player, 'X')

    def test_available_moves_decrease(self):
        """Available moves should decrease after each move."""
        initial_count = len(self.game.get_available_moves())
        self.game.make_move(5)
        self.assertEqual(len(self.game.get_available_moves()), initial_count - 1)

if __name__ == '__main__':
    unittest.main()
