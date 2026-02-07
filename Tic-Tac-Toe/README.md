# 🎮 Premium Tic Tac Toe

A feature-rich, polished Tic Tac Toe game built with Python. Features include a beautiful CLI with themes, multiple AI difficulties, and two graphical interfaces (Tkinter & Pygame).

## ✨ Features

- **Multiple Game Modes**:
  - 👥 **Player vs Player**: Play against a friend on the same machine.
  - 🤖 **Player vs AI**: Challenge 4 levels of AI difficulty.
  - 👁️ **AI vs AI**: Watch robots battle it out.
- **Advanced AI**:
  - 🟢 **Easy**: Random moves.
  - 🟡 **Medium**: Blocks wins and takes winning moves.
  - 🔴 **Hard**: Unbeatable Minimax algorithm.
  - 🟣 **Impossible**: Minimax with Alpha-Beta pruning for faster decisions.
- **Rich Interfaces**:
  - 📋 **CLI**: Supports several color themes (Neon, Retro, Minimal) and board styles (Box, Emoji).
  - 🖥️ **Tkinter**: A classic, clean desktop GUI.
  - 🎮 **Pygame**: A premium gaming experience with animations and particle effects.
- **Tracking & Persistence**:
  - 🏆 **Leaderboard**: Track all-time leaders.
  - 📊 **Statistics**: Detailed win/loss/streak tracking saved to JSON.
  - ⚙️ **Settings**: Customizable symbols, sounds, and thinking delays.

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- [Colorama](https://pypi.org/project/colorama/)
- [Pygame](https://pypi.org/project/pygame/) (Optional, for Pygame GUI)

### Installation

1. Clone the repository or download the source code.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Game

Launch the main menu using:

```bash
python main.py
```

## 🧪 Testing

Run the automated test suite to verify game logic:

```bash
python -m unittest discover tests
```

## 📂 File Structure

- `main.py`: Entry point for the CLI application.
- `game.py`: Core Tic Tac Toe logic.
- `ai.py`: Implementation of different AI strategies.
- `display.py`: CLI rendering engine with theme support.
- `gui_tkinter.py`: Tkinter-based graphical interface.
- `gui_pygame.py`: Advanced Pygame-based graphical interface.
- `scores.py`: Handles statistics and leaderboard persistence.
- `settings.py`: Manages game configurations.
- `tests/`: Unit test suite.

## 🛠️ Development

Built with an object-oriented approach focusing on clean architecture and separation of concerns.

---

Enjoy the game! 🚀
