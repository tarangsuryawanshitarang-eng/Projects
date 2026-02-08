# 🔐 Secure Password Generator

A full-featured, secure Password Generator application built with Python.

## Features

- **Multiple Generation Modes**: Random, Passphrase (Diceware), Pronounceable, PIN, Pattern-based.
- **Strength Analysis**: Real-time scoring, entropy calculation, and crack time estimation.
- **Breach Checking**: Privacy-preserving check against 10+ billion leaked passwords (HIBP API).
- **Encrypted History**: Securely store generated passwords with a master password.
- **Multiple Interfaces**: Modern Command-Line Interface (CLI) and Tkinter Graphical User Interface (GUI).
- **Utilities**: Clipboard integration with auto-clear, export to CSV/JSON/TXT, and QR code generation.

## Installation

1. Clone the repository or download the files.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### GUI Mode

Launch the graphical interface:

```bash
python gui.py
```

### CLI Mode

Generate a default 16-character password:

```bash
python passgen.py
```

Generate a 24-character password and copy to clipboard:

```bash
python passgen.py --length 24 --copy
```

Generate a 5-word passphrase:

```bash
python passgen.py --mode passphrase --words 5
```

Interactive interactive mode:

```bash
python passgen.py --interactive
```

Check a password for breaches:

```bash
python passgen.py --check-breach "your-password"
```

## Project Structure

- `generators/`: Core generation algorithms (random, passphrase, etc.)
- `analyzer/`: Password strength and breach checking logic.
- `utils/`: Helpers for clipboard, encryption, history, and export.
- `passgen.py`: Main CLI entry point.
- `gui.py`: Main GUI entry point.
- `interactive.py`: Interactive CLI mode logic.
