"""Pygame GUI for Tic Tac Toe."""

import pygame
import sys

from game import TicTacToe
from ai import EasyAI, MediumAI, HardAI

# Initialize
pygame.init()

# Constants
WIDTH, HEIGHT = 600, 700
BOARD_SIZE = 450
CELL_SIZE = BOARD_SIZE // 3
BOARD_OFFSET_X = (WIDTH - BOARD_SIZE) // 2
BOARD_OFFSET_Y = 150

# Colors
BG_COLOR = (26, 26, 46)
LINE_COLOR = (108, 99, 255)
X_COLOR = (0, 217, 255)
O_COLOR = (255, 107, 107)
TEXT_COLOR = (224, 224, 224)
WIN_COLOR = (0, 230, 118)
BUTTON_COLOR = (108, 99, 255)
BUTTON_HOVER = (90, 82, 213)

# Fonts
try:
    TITLE_FONT = pygame.font.Font(None, 48)
    STATUS_FONT = pygame.font.Font(None, 32)
except Exception:
    TITLE_FONT = pygame.font.SysFont("arial", 36)
    STATUS_FONT = pygame.font.SysFont("arial", 24)


def draw_board(screen):
    """Draw the game board lines."""
    for i in range(1, 3):
        x = BOARD_OFFSET_X + i * CELL_SIZE
        pygame.draw.line(
            screen, LINE_COLOR,
            (x, BOARD_OFFSET_Y),
            (x, BOARD_OFFSET_Y + BOARD_SIZE), 4
        )
        y = BOARD_OFFSET_Y + i * CELL_SIZE
        pygame.draw.line(
            screen, LINE_COLOR,
            (BOARD_OFFSET_X, y),
            (BOARD_OFFSET_X + BOARD_SIZE, y), 4
        )


def draw_x(screen, row, col):
    """Draw an X in the specified cell."""
    margin = 30
    x1 = BOARD_OFFSET_X + col * CELL_SIZE + margin
    y1 = BOARD_OFFSET_Y + row * CELL_SIZE + margin
    x2 = BOARD_OFFSET_X + (col + 1) * CELL_SIZE - margin
    y2 = BOARD_OFFSET_Y + (row + 1) * CELL_SIZE - margin

    pygame.draw.line(screen, X_COLOR, (x1, y1), (x2, y2), 6)
    pygame.draw.line(screen, X_COLOR, (x2, y1), (x1, y2), 6)


def draw_o(screen, row, col):
    """Draw an O in the specified cell."""
    margin = 30
    center_x = BOARD_OFFSET_X + col * CELL_SIZE + CELL_SIZE // 2
    center_y = BOARD_OFFSET_Y + row * CELL_SIZE + CELL_SIZE // 2
    radius = CELL_SIZE // 2 - margin

    pygame.draw.circle(screen, O_COLOR, (center_x, center_y), radius, 6)


def draw_winning_line(screen, winning_combo):
    """Draw a line through the winning combination."""
    if not winning_combo or len(winning_combo) != 3:
        return

    # Convert positions 1-9 to centers
    centers = []
    for pos in winning_combo:
        row = (pos - 1) // 3
        col = (pos - 1) % 3
        cx = BOARD_OFFSET_X + col * CELL_SIZE + CELL_SIZE // 2
        cy = BOARD_OFFSET_Y + row * CELL_SIZE + CELL_SIZE // 2
        centers.append((cx, cy))

    if len(centers) == 3:
        pygame.draw.line(screen, WIN_COLOR, centers[0], centers[2], 8)


def get_cell_from_mouse(pos):
    """Convert mouse position to board cell (row, col)."""
    x, y = pos
    if (BOARD_OFFSET_X <= x <= BOARD_OFFSET_X + BOARD_SIZE and
            BOARD_OFFSET_Y <= y <= BOARD_OFFSET_Y + BOARD_SIZE):
        col = (x - BOARD_OFFSET_X) // CELL_SIZE
        row = (y - BOARD_OFFSET_Y) // CELL_SIZE
        return row, col
    return None


def main():
    """Main Pygame loop."""
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Tic Tac Toe - Pygame")
    clock = pygame.time.Clock()

    game = TicTacToe()
    ai = None
    ai_turn = False
    ai_delay = 0

    running = True

    while running:
        # AI turn with delay
        if ai_turn and ai and not game.game_over:
            ai_delay -= clock.get_time()
            if ai_delay <= 0:
                move = ai.get_move(game)
                game.make_move(move)
                ai_turn = False

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            if event.type == pygame.MOUSEBUTTONDOWN and not ai_turn:
                cell = get_cell_from_mouse(event.pos)
                if cell:
                    row, col = cell
                    position = row * 3 + col + 1
                    if game.is_valid_move(position):
                        game.make_move(position)
                        if ai and not game.game_over and game.current_player == 'O':
                            ai_turn = True
                            ai_delay = 500

            # New Game on N key
            if event.type == pygame.KEYDOWN and event.key == pygame.K_n:
                game.reset()
                ai_turn = False

        # Draw
        screen.fill(BG_COLOR)

        title = TITLE_FONT.render("TIC TAC TOE", True, LINE_COLOR)
        screen.blit(title, (WIDTH // 2 - title.get_width() // 2, 30))

        if game.game_over:
            if game.winner:
                status_text = f"Player {game.winner} Wins!"
                status_color = WIN_COLOR
            else:
                status_text = "It's a Draw!"
                status_color = (255, 214, 0)
        else:
            status_text = f"Player {game.current_player}'s Turn"
            status_color = X_COLOR if game.current_player == 'X' else O_COLOR

        status = STATUS_FONT.render(status_text, True, status_color)
        screen.blit(status, (WIDTH // 2 - status.get_width() // 2, 90))

        draw_board(screen)

        for pos in range(1, 10):
            val = game.board[pos]
            if val != ' ':
                row = (pos - 1) // 3
                col = (pos - 1) % 3
                if val == 'X':
                    draw_x(screen, row, col)
                else:
                    draw_o(screen, row, col)

        if game.winner:
            winning_combo = game.get_winning_combo(game.winner)
            draw_winning_line(screen, winning_combo)

        # New Game hint
        hint = STATUS_FONT.render("Press N for New Game", True, TEXT_COLOR)
        screen.blit(hint, (WIDTH // 2 - hint.get_width() // 2, HEIGHT - 40))

        pygame.display.flip()
        clock.tick(60)

    pygame.quit()
    sys.exit()


if __name__ == "__main__":
    main()
