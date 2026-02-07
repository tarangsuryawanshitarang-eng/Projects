"""Advanced Pygame GUI for Tic Tac Toe with animations and effects."""

import pygame
import sys
import math
import random

from game import TicTacToe
from ai import EasyAI, MediumAI, HardAI

# Constants
WIDTH, HEIGHT = 600, 750
BOARD_SIZE = 450
CELL_SIZE = BOARD_SIZE // 3
BOARD_OFFSET_X = (WIDTH - BOARD_SIZE) // 2
BOARD_OFFSET_Y = 180

# Colors
BG_COLOR = (26, 26, 46)
BORDER_COLOR = (22, 33, 62)
LINE_COLOR = (108, 99, 255)
X_COLOR = (0, 217, 255)
O_COLOR = (255, 107, 107)
TEXT_COLOR = (224, 224, 224)
WIN_COLOR = (0, 230, 118)
HINT_COLOR = (78, 79, 115)
PARTICLE_COLOR = (255, 214, 0)

class Particle:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.vx = random.uniform(-5, 5)
        self.vy = random.uniform(-5, 5)
        self.lifetime = 1.0
        self.color = random.choice([PARTICLE_COLOR, WIN_COLOR, X_COLOR, O_COLOR])
        self.size = random.randint(2, 5)

    def update(self, dt):
        self.x += self.vx
        self.y += self.vy
        self.vy += 0.1  # Gravity
        self.lifetime -= dt
        return self.lifetime > 0

    def draw(self, screen):
        alpha = int(self.lifetime * 255)
        s = pygame.Surface((self.size*2, self.size*2), pygame.SRCALPHA)
        pygame.draw.circle(s, (*self.color, alpha), (self.size, self.size), self.size)
        screen.blit(s, (self.x - self.size, self.y - self.size))

class AnimatedPiece:
    def __init__(self, row, col, type):
        self.row = row
        self.col = col
        self.type = type
        self.progress = 0.0
        self.done = False

    def update(self, dt):
        if not self.done:
            self.progress = min(1.0, self.progress + dt * 4)  # 0.25s animation
            if self.progress >= 1.0:
                self.done = True

    def draw(self, screen):
        margin = 35
        cx = BOARD_OFFSET_X + self.col * CELL_SIZE + CELL_SIZE // 2
        cy = BOARD_OFFSET_Y + self.row * CELL_SIZE + CELL_SIZE // 2
        
        if self.type == 'X':
            self.draw_x(screen, cx, cy, margin)
        else:
            self.draw_o(screen, cx, cy, margin)

    def draw_x(self, screen, cx, cy, margin):
        half = CELL_SIZE // 2 - margin
        # First stroke
        p1 = self.progress * 2
        if p1 > 1.0: p1 = 1.0
        if p1 > 0:
            start = (cx - half, cy - half)
            end = (cx - half + (half * 2 * p1), cy - half + (half * 2 * p1))
            pygame.draw.line(screen, X_COLOR, start, end, 8)
        
        # Second stroke
        p2 = (self.progress - 0.5) * 2
        if p2 > 1.0: p2 = 1.0
        if p2 > 0:
            start = (cx + half, cy - half)
            end = (cx + half - (half * 2 * p2), cy - half + (half * 2 * p2))
            pygame.draw.line(screen, X_COLOR, start, end, 8)

    def draw_o(self, screen, cx, cy, margin):
        radius = CELL_SIZE // 2 - margin
        rect = pygame.Rect(cx - radius, cy - radius, radius * 2, radius * 2)
        if self.progress > 0:
            pygame.draw.arc(screen, O_COLOR, rect, 0, self.progress * math.pi * 2, 8)

def draw_board(screen):
    """Draw the game grid."""
    # Background for board
    board_rect = pygame.Rect(BOARD_OFFSET_X, BOARD_OFFSET_Y, BOARD_SIZE, BOARD_SIZE)
    pygame.draw.rect(screen, BORDER_COLOR, board_rect)
    
    # Grid lines
    for i in range(1, 3):
        x = BOARD_OFFSET_X + i * CELL_SIZE
        pygame.draw.line(screen, LINE_COLOR, (x, BOARD_OFFSET_Y), (x, BOARD_OFFSET_Y + BOARD_SIZE), 5)
        y = BOARD_OFFSET_Y + i * CELL_SIZE
        pygame.draw.line(screen, LINE_COLOR, (BOARD_OFFSET_X, y), (BOARD_OFFSET_X + BOARD_SIZE, y), 5)

def main():
    """Main Pygame logic."""
    pygame.init()
    if pygame.mixer.get_init():
        # Optional: pygame.mixer.music.load("bg_music.mp3")
        pass
    
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Tic Tac Toe — Premium Edition")
    clock = pygame.time.Clock()
    
    try:
        title_font = pygame.font.Font(None, 64)
        status_font = pygame.font.Font(None, 36)
        ui_font = pygame.font.Font(None, 28)
    except:
        title_font = pygame.font.SysFont("arial", 48, bold=True)
        status_font = pygame.font.SysFont("arial", 28)
        ui_font = pygame.font.SysFont("arial", 22)

    game = TicTacToe()
    ai = None
    ai_choice = "Player"
    
    animated_pieces = []
    particles = []
    
    running = True
    ai_turn = False
    ai_delay = 0
    winner_notified = False

    while running:
        dt = clock.tick(60) / 1000.0
        
        # --- Handle Input ---
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            
            if event.type == pygame.MOUSEBUTTONDOWN and not game.game_over and not ai_turn:
                pos = event.pos
                if (BOARD_OFFSET_X <= pos[0] < BOARD_OFFSET_X + BOARD_SIZE and 
                    BOARD_OFFSET_Y <= pos[1] < BOARD_OFFSET_Y + BOARD_SIZE):
                    col = (pos[0] - BOARD_OFFSET_X) // CELL_SIZE
                    row = (pos[1] - BOARD_OFFSET_Y) // CELL_SIZE
                    position = row * 3 + col + 1
                    
                    if game.is_valid_move(position):
                        game.make_move(position)
                        animated_pieces.append(AnimatedPiece(row, col, 'X'))
                        if ai and not game.game_over:
                            ai_turn = True
                            ai_delay = 0.6
                
                # Check mode buttons (simple area checks)
                if pos[1] < 100:
                    if 20 < pos[0] < 150: 
                        ai = None; ai_choice = "Player"; game.reset(); animated_pieces = []; winner_notified = False
                    elif 160 < pos[0] < 290:
                        ai = EasyAI('O'); ai_choice = "Easy AI"; game.reset(); animated_pieces = []; winner_notified = False
                    elif 300 < pos[0] < 430:
                        ai = MediumAI('O'); ai_choice = "Medium AI"; game.reset(); animated_pieces = []; winner_notified = False
                    elif 440 < pos[0] < 570:
                        ai = HardAI('O'); ai_choice = "Hard AI"; game.reset(); animated_pieces = []; winner_notified = False

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_n:
                    game.reset()
                    animated_pieces = []
                    particles = []
                    ai_turn = False
                    winner_notified = False

        # --- AI Strategy ---
        if ai_turn and not game.game_over:
            ai_delay -= dt
            if ai_delay <= 0:
                move = ai.get_move(game)
                row, col = (move - 1) // 3, (move - 1) % 3
                game.make_move(move)
                animated_pieces.append(AnimatedPiece(row, col, 'O'))
                ai_turn = False

        # --- Update Effects ---
        for p in animated_pieces:
            p.update(dt)
            
        particles = [p for p in particles if p.update(dt)]
        
        if game.game_over and game.winner and not winner_notified:
            # Spawn fireworks
            for _ in range(50):
                particles.append(Particle(WIDTH // 2, HEIGHT // 2))
            winner_notified = True

        # --- Draw Everything ---
        screen.fill(BG_COLOR)
        
        # Draw Mode Selector
        modes = ["PvP", "vs Easy", "vs Medium", "vs Hard"]
        for i, m in enumerate(modes):
            col = X_COLOR if (i==0 and ai is None) or (i==1 and isinstance(ai, EasyAI)) or \
                           (i==2 and isinstance(ai, MediumAI)) or (i==3 and isinstance(ai, HardAI)) else TEXT_COLOR
            btn_rect = pygame.Rect(20 + i*140, 40, 130, 40)
            pygame.draw.rect(screen, col, btn_rect, 2, 5)
            txt = ui_font.render(m, True, col)
            screen.blit(txt, (btn_rect.centerx - txt.get_width()//2, btn_rect.centery - txt.get_height()//2))

        # Title
        title_txt = title_font.render("TIC TAC TOE", True, LINE_COLOR)
        screen.blit(title_txt, (WIDTH // 2 - title_txt.get_width() // 2, 110))
        
        # Status
        if game.game_over:
            if game.winner:
                s_txt = f"{game.winner} Wins!"
                s_col = WIN_COLOR
            else:
                s_txt = "Draw!"
                s_col = PARTICLE_COLOR
        else:
            s_txt = f"{game.current_player}'s Turn"
            s_col = X_COLOR if game.current_player == 'X' else O_COLOR
        
        status_txt = status_font.render(s_txt, True, s_col)
        screen.blit(status_txt, (WIDTH // 2 - status_txt.get_width() // 2, 700))

        draw_board(screen)
        
        # Hint numbers
        if not game.game_over:
            for i in range(3):
                for j in range(3):
                    pos = i * 3 + j + 1
                    if game.board[pos] == ' ':
                        num_txt = ui_font.render(str(pos), True, HINT_COLOR)
                        screen.blit(num_txt, (BOARD_OFFSET_X + j * CELL_SIZE + 10, BOARD_OFFSET_Y + i * CELL_SIZE + 10))

        # Pieces
        for p in animated_pieces:
            p.draw(screen)

        # Winning line
        if game.game_over and game.winner:
            combo = game.get_winning_combo(game.winner)
            if combo:
                c1 = combo[0]
                c3 = combo[2]
                p1 = (BOARD_OFFSET_X + ((c1-1)%3) * CELL_SIZE + CELL_SIZE//2, 
                      BOARD_OFFSET_Y + ((c1-1)//3) * CELL_SIZE + CELL_SIZE//2)
                p2 = (BOARD_OFFSET_X + ((c3-1)%3) * CELL_SIZE + CELL_SIZE//2, 
                      BOARD_OFFSET_Y + ((c3-1)//3) * CELL_SIZE + CELL_SIZE//2)
                pygame.draw.line(screen, WIN_COLOR, p1, p2, 10)

        # Particles
        for p in particles:
            p.draw(screen)

        pygame.display.flip()

    pygame.quit()

if __name__ == "__main__":
    main()
