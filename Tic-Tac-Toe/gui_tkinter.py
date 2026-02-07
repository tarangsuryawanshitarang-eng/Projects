"""Tkinter GUI for Tic Tac Toe."""

import tkinter as tk
from tkinter import messagebox, ttk

from game import TicTacToe
from ai import EasyAI, MediumAI, HardAI


class TicTacToeGUI:
    """Graphical User Interface for Tic Tac Toe."""

    COLORS = {
        "bg": "#1a1a2e",
        "board_bg": "#16213e",
        "cell_bg": "#0f3460",
        "cell_hover": "#1a4080",
        "x_color": "#00d9ff",
        "o_color": "#ff6b6b",
        "text": "#e0e0e0",
        "accent": "#6c63ff",
        "win_color": "#00e676",
        "draw_color": "#ffd600",
        "button_bg": "#6c63ff",
        "button_hover": "#5a52d5",
    }

    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Tic Tac Toe")
        self.root.configure(bg=self.COLORS["bg"])
        self.root.resizable(False, False)

        self.game = TicTacToe()
        self.mode = "pvp"
        self.ai = None
        self.ai_difficulty = "medium"
        self.score = {"X": 0, "O": 0, "Draw": 0}
        self.buttons = {}

        self.create_widgets()
        self.center_window()

    def create_widgets(self):
        """Create all GUI widgets."""
        title_frame = tk.Frame(self.root, bg=self.COLORS["bg"])
        title_frame.pack(pady=(20, 10))

        tk.Label(
            title_frame,
            text="TIC TAC TOE",
            font=("Helvetica", 28, "bold"),
            fg=self.COLORS["accent"],
            bg=self.COLORS["bg"]
        ).pack()

        info_frame = tk.Frame(self.root, bg=self.COLORS["bg"])
        info_frame.pack(pady=10)

        self.status_label = tk.Label(
            info_frame,
            text="Player X's Turn",
            font=("Helvetica", 14),
            fg=self.COLORS["text"],
            bg=self.COLORS["bg"]
        )
        self.status_label.pack()

        self.score_label = tk.Label(
            info_frame,
            text="X: 0  │  O: 0  │  Draw: 0",
            font=("Helvetica", 11),
            fg=self.COLORS["text"],
            bg=self.COLORS["bg"]
        )
        self.score_label.pack(pady=(5, 0))

        board_frame = tk.Frame(
            self.root,
            bg=self.COLORS["board_bg"],
            padx=8, pady=8
        )
        board_frame.pack(pady=15)

        for i in range(3):
            for j in range(3):
                pos = i * 3 + j + 1
                btn = tk.Button(
                    board_frame,
                    text="",
                    font=("Helvetica", 36, "bold"),
                    width=4, height=2,
                    bg=self.COLORS["cell_bg"],
                    fg=self.COLORS["text"],
                    activebackground=self.COLORS["cell_hover"],
                    relief="flat",
                    borderwidth=0,
                    cursor="hand2",
                    command=lambda p=pos: self.cell_clicked(p)
                )
                btn.grid(row=i, column=j, padx=3, pady=3)
                self.buttons[pos] = btn

                btn.bind("<Enter>", lambda e, b=btn: self.on_cell_hover(b, True))
                btn.bind("<Leave>", lambda e, b=btn: self.on_cell_hover(b, False))

        controls_frame = tk.Frame(self.root, bg=self.COLORS["bg"])
        controls_frame.pack(pady=10)

        mode_frame = tk.Frame(controls_frame, bg=self.COLORS["bg"])
        mode_frame.pack(pady=5)

        tk.Label(
            mode_frame, text="Mode:",
            font=("Helvetica", 10),
            fg=self.COLORS["text"],
            bg=self.COLORS["bg"]
        ).pack(side="left", padx=5)

        self.mode_var = tk.StringVar(value="pvp")
        mode_menu = ttk.Combobox(
            mode_frame,
            textvariable=self.mode_var,
            values=["Player vs Player", "Player vs AI (Easy)",
                    "Player vs AI (Medium)", "Player vs AI (Hard)"],
            state="readonly",
            width=22
        )
        mode_menu.current(0)
        mode_menu.pack(side="left", padx=5)
        mode_menu.bind("<<ComboboxSelected>>", self.on_mode_change)

        btn_frame = tk.Frame(controls_frame, bg=self.COLORS["bg"])
        btn_frame.pack(pady=10)

        for text, command in [
            ("🔄 New Game", self.new_game),
            ("↩ Undo", self.undo_move),
            ("📊 Stats", self.show_stats),
        ]:
            btn = tk.Button(
                btn_frame,
                text=text,
                font=("Helvetica", 10, "bold"),
                bg=self.COLORS["button_bg"],
                fg="white",
                activebackground=self.COLORS["button_hover"],
                relief="flat",
                padx=15, pady=5,
                cursor="hand2",
                command=command
            )
            btn.pack(side="left", padx=5)

    def cell_clicked(self, position):
        """Handle a cell click."""
        if self.game.game_over:
            return
        if not self.game.is_valid_move(position):
            return

        player = self.game.current_player
        self.game.make_move(position)
        self.update_cell(position, player)

        if self.game.game_over:
            self.handle_game_over()
            return

        self.update_status()

        if self.ai and self.game.current_player == 'O':
            self.root.after(500, self.ai_move)

    def ai_move(self):
        """Let the AI make a move."""
        if self.game.game_over:
            return

        move = self.ai.get_move(self.game)
        player = self.game.current_player
        self.game.make_move(move)
        self.update_cell(move, player)

        if self.game.game_over:
            self.handle_game_over()
        else:
            self.update_status()

    def update_cell(self, position, player):
        """Update the visual of a cell."""
        btn = self.buttons[position]
        color = self.COLORS["x_color"] if player == 'X' else self.COLORS["o_color"]
        btn.config(
            text=player,
            fg=color,
            state="disabled",
            disabledforeground=color
        )

    def handle_game_over(self):
        """Handle end of game."""
        if self.game.winner:
            winning_combo = self.game.get_winning_combo(self.game.winner)
            for pos in winning_combo:
                self.buttons[pos].config(
                    bg=self.COLORS["win_color"],
                    disabledforeground="white"
                )
            self.score[self.game.winner] += 1
            self.status_label.config(
                text=f"🎉 Player {self.game.winner} Wins!",
                fg=self.COLORS["win_color"]
            )
        else:
            self.score["Draw"] += 1
            for pos in range(1, 10):
                self.buttons[pos].config(
                    bg=self.COLORS["draw_color"],
                    disabledforeground="#333"
                )
            self.status_label.config(
                text="🤝 It's a Draw!",
                fg=self.COLORS["draw_color"]
            )

        self.update_score_display()

    def update_status(self):
        """Update the status label."""
        player = self.game.current_player
        color = self.COLORS["x_color"] if player == 'X' else self.COLORS["o_color"]
        self.status_label.config(
            text=f"Player {player}'s Turn",
            fg=color
        )

    def update_score_display(self):
        """Update the score display."""
        self.score_label.config(
            text=f"X: {self.score['X']}  │  O: {self.score['O']}  │  Draw: {self.score['Draw']}"
        )

    def new_game(self):
        """Start a new game."""
        self.game.reset()
        for pos in range(1, 10):
            self.buttons[pos].config(
                text="",
                bg=self.COLORS["cell_bg"],
                fg=self.COLORS["text"],
                state="normal"
            )
        self.update_status()

        if self.ai and self.game.current_player == 'O':
            self.root.after(500, self.ai_move)

    def undo_move(self):
        """Undo the last move."""
        if not self.game.undo_move():
            return

        # Redraw entire board from game state
        for pos in range(1, 10):
            val = self.game.board[pos]
            btn = self.buttons[pos]
            if val == ' ':
                btn.config(
                    text="", bg=self.COLORS["cell_bg"],
                    state="normal"
                )
            else:
                color = self.COLORS["x_color"] if val == 'X' else self.COLORS["o_color"]
                btn.config(
                    text=val, fg=color,
                    bg=self.COLORS["cell_bg"],
                    state="disabled",
                    disabledforeground=color
                )
        self.update_status()

    def show_stats(self):
        """Show statistics in a popup."""
        total = sum(self.score.values())
        msg = (
            f"📊 Game Statistics\n\n"
            f"🏆 X Wins: {self.score['X']}\n"
            f"🏆 O Wins: {self.score['O']}\n"
            f"🤝 Draws: {self.score['Draw']}\n"
            f"🎮 Total: {total}\n"
        )
        if total > 0:
            msg += f"\n📈 X Win Rate: {self.score['X']/total*100:.0f}%"
            msg += f"\n📈 O Win Rate: {self.score['O']/total*100:.0f}%"
        messagebox.showinfo("Statistics", msg)

    def on_mode_change(self, event):
        """Handle mode selection change."""
        selection = self.mode_var.get()

        if "Player vs Player" in selection:
            self.ai = None
        elif "Easy" in selection:
            self.ai = EasyAI('O')
        elif "Medium" in selection:
            self.ai = MediumAI('O')
        elif "Hard" in selection:
            self.ai = HardAI('O')

        self.new_game()

    def on_cell_hover(self, button, entering):
        """Handle cell hover effect."""
        if button["state"] != "disabled":
            if entering:
                button.config(bg=self.COLORS["cell_hover"])
            else:
                button.config(bg=self.COLORS["cell_bg"])

    def center_window(self):
        """Center the window on screen."""
        self.root.update_idletasks()
        width = self.root.winfo_width()
        height = self.root.winfo_height()
        x = (self.root.winfo_screenwidth() // 2) - (width // 2)
        y = (self.root.winfo_screenheight() // 2) - (height // 2)
        self.root.geometry(f"+{x}+{y}")

    def run(self):
        """Start the GUI application."""
        self.root.mainloop()


if __name__ == "__main__":
    app = TicTacToeGUI()
    app.run()
