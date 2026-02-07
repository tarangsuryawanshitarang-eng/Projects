@echo off
cd /d "%~dp0"
if not exist venv\Scripts\python.exe (
    echo Creating virtual environment...
    python -m venv venv
    venv\Scripts\pip install -r requirements.txt
)
echo.
echo Face Recognition Attendance System
echo ==================================
echo  1. Register  -  venv\Scripts\python main.py register
echo  2. Attend    -  venv\Scripts\python main.py attend
echo  3. Detect    -  venv\Scripts\python main.py detect
echo  4. GUI       -  venv\Scripts\python gui.py
echo.
venv\Scripts\python main.py attend
