# Face Recognition + Attendance System

A Python-based Face Recognition and Attendance System using **OpenCV** (Haar Cascade + LBPH) to detect faces from a live webcam, recognize registered individuals, and log attendance with date, time, and status. **No dlib or face_recognition required** — runs on Windows, macOS, and Linux with minimal dependencies.

## Features

- **Face Detection** – Haar Cascade (built-in) and optional DNN model
- **Face Registration** – Enroll new users with multiple face captures
- **Real-time Recognition** – Identify faces from webcam feed
- **Attendance Logging** – Check-in/check-out with SQLite database
- **Anti-spoofing** – Optional blink-based liveness detection
- **CLI & GUI** – Command-line and Tkinter graphical interface
- **Reports & Export** – CSV/Excel export, date-range reports

## Quick Start

### 1. Setup

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Note:** This project uses OpenCV's built-in LBPH face recognizer — no dlib or face_recognition needed.

### 2. Register a User

```bash
python main.py register
```

Follow the prompts to enter Employee ID, Name, Department, Email. Press **C** to capture 5 face images, **Q** to quit.

### 3. Start Attendance System

```bash
python main.py attend
```

- **Q** – Quit  
- **R** – Print today's report  
- **A** – Add new user (pauses camera)

### 4. GUI (Optional)

```bash
python gui.py
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `python main.py register` | Register a new user |
| `python main.py attend` | Start attendance system |
| `python main.py attend --liveness` | With anti-spoofing |
| `python main.py report --today` | Today's attendance |
| `python main.py report --date 2025-03-15` | Specific date |
| `python main.py report --from 2025-03-01 --to 2025-03-31` | Date range |
| `python main.py report --user EMP001` | User's history |
| `python main.py export --format csv -o report.csv` | Export to CSV |
| `python main.py users --list` | List registered users |
| `python main.py config --show` | Show config |
| `python main.py diagnose` | System diagnostics |
| `python main.py detect` | Face detection demo |

## Project Structure

```
Face-Recogination-app/
├── main.py              # CLI entry point
├── gui.py               # GUI application
├── config.json          # Configuration
├── requirements.txt
├── download_models.py   # Optional: DNN & liveness models
├── modules/
│   ├── face_detector.py
│   ├── face_recognizer.py
│   ├── face_register.py
│   ├── attendance_manager.py
│   ├── liveness.py
│   ├── report_generator.py
│   └── config_manager.py
├── data/
│   ├── faces/           # Registered face images
│   ├── encodings.pkl    # Face encodings
│   └── attendance.db    # SQLite database
├── models/              # Pre-trained models (run download_models.py)
└── exports/             # Exported reports
```

## Configuration

Edit `config.json` to change:

- Camera index, resolution
- Recognition threshold (0.5 = default)
- Attendance cooldown (seconds)
- Paths for data, encodings, exports

## Tech Stack

- **Python 3.8+**
- **OpenCV (opencv-contrib-python)** – Camera, face detection (Haar), face recognition (LBPH)
- **SQLite** – Attendance database
- **pandas** – Export to CSV/Excel
- **Tkinter** – GUI (built-in)

## Privacy & Security

- Get explicit consent before collecting face data
- Store encodings securely; consider encryption
- Implement access control for admin/reports
- Be aware of local privacy laws (GDPR, etc.)

## License

MIT
