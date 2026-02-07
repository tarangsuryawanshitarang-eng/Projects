import unittest
from game import TicTacToe
from ai import EasyAI, HardAI

class TestAI(unittest.TestCase):

    def test_easy_ai_returns_valid_move(self):
        """Easy AI should always return a valid move."""
        game = TicTacToe()
        ai = EasyAI('O')
        game.make_move(5)  # X plays center
        move = ai.get_move(game)
        self.assertIn(move, game.get_available_moves())

    def test_hard_ai_blocks_win(self):
        """Hard AI should block opponent from winning."""
        game = TicTacToe()
        ai = HardAI('O')
        game.make_move(1)  # X
        game.make_move(4)  # O random
        game.make_move(2)  # X - threatens 3
        # It's O's turn now
        move = ai.get_move(game)
        self.assertEqual(move, 3)

    def test_hard_ai_takes_win(self):
        """Hard AI should take winning move if available."""
        game = TicTacToe()
        ai = HardAI('O')
        game.board[1] = 'O'
        game.board[2] = 'O'
        game.move_count = 4
        game.current_player = 'O'
        move = ai.get_move(game)
        self.assertEqual(move, 3)

    def test_hard_ai_never_loses(self):
        """Hard AI should never lose against a random player."""
        import random
        losses = 0
        for _ in range(50): # Reduced count for faster testing
            game = TicTacToe()
            ai = HardAI('O')
            while not game.game_over:
                if game.current_player == 'X':
                    move = random.choice(game.get_available_moves())
                else:
                    move = ai.get_move(game)
                game.make_move(move)
            if game.winner == 'X':
                losses += 1
        self.assertEqual(losses, 0, "Hard AI should NEVER lose!")

if __name__ == '__main__':
    unittest.main()
