"""Attendance logging and database management."""

import sqlite3
import os
from datetime import datetime, timedelta


class AttendanceManager:
    """Manages attendance records in SQLite database."""

    def __init__(self, db_path: str = "data/attendance.db", cooldown: int = 30):
        os.makedirs(os.path.dirname(db_path) or ".", exist_ok=True)
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
        self.cooldown = cooldown
        self.last_marked = {}
        self.create_tables()

    def create_tables(self) -> None:
        """Create database tables if they don't exist."""
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                employee_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                department TEXT,
                email TEXT,
                registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )
        """)
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id TEXT NOT NULL,
                name TEXT NOT NULL,
                date TEXT NOT NULL,
                check_in_time TEXT,
                check_out_time TEXT,
                status TEXT DEFAULT 'Present',
                confidence REAL,
                FOREIGN KEY (employee_id) REFERENCES users(employee_id),
                UNIQUE(employee_id, date)
            )
        """)
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS recognition_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id TEXT,
                name TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                confidence REAL,
                is_known BOOLEAN
            )
        """)
        self.conn.commit()

    def add_user(self, employee_id: str, name: str, department: str = "", email: str = "") -> None:
        """Add or update user in users table."""
        self.cursor.execute("""
            INSERT OR REPLACE INTO users (employee_id, name, department, email)
            VALUES (?, ?, ?, ?)
        """, (employee_id, name, department, email))
        self.conn.commit()

    def mark_attendance(self, employee_id: str, name: str, confidence: float) -> str | None:
        """Mark attendance for a recognized person. Returns status string or None if cooldown."""
        now = datetime.now()
        today = now.strftime("%Y-%m-%d")
        current_time = now.strftime("%H:%M:%S")

        if employee_id in self.last_marked:
            elapsed = (now - self.last_marked[employee_id]).total_seconds()
            if elapsed < self.cooldown:
                return None

        self.last_marked[employee_id] = now

        self.cursor.execute("""
            INSERT INTO recognition_log (employee_id, name, confidence, is_known)
            VALUES (?, ?, ?, 1)
        """, (employee_id, name, confidence))

        self.cursor.execute(
            "SELECT id, check_in_time, check_out_time FROM attendance WHERE employee_id = ? AND date = ?",
            (employee_id, today),
        )
        record = self.cursor.fetchone()

        if record is None:
            self.cursor.execute("""
                INSERT INTO attendance (employee_id, name, date, check_in_time, confidence, status)
                VALUES (?, ?, ?, ?, ?, 'Present')
            """, (employee_id, name, today, current_time, confidence))
            self.conn.commit()
            return "CHECK-IN"
        elif record[2] is None:
            self.cursor.execute(
                "UPDATE attendance SET check_out_time = ? WHERE employee_id = ? AND date = ?",
                (current_time, employee_id, today),
            )
            self.conn.commit()
            return "CHECK-OUT"
        else:
            return "ALREADY-MARKED"

    def get_today_attendance(self) -> list:
        """Get today's attendance records."""
        today = datetime.now().strftime("%Y-%m-%d")
        self.cursor.execute("""
            SELECT employee_id, name, check_in_time, check_out_time, status
            FROM attendance WHERE date = ?
            ORDER BY check_in_time
        """, (today,))
        return self.cursor.fetchall()

    def get_attendance_by_date(self, date: str) -> list:
        """Get attendance for a specific date."""
        self.cursor.execute("""
            SELECT employee_id, name, check_in_time, check_out_time, status
            FROM attendance WHERE date = ?
            ORDER BY check_in_time
        """, (date,))
        return self.cursor.fetchall()

    def get_attendance_report(self, start_date: str, end_date: str) -> list:
        """Get attendance report for date range."""
        self.cursor.execute("""
            SELECT employee_id, name, date, check_in_time, check_out_time, status
            FROM attendance
            WHERE date BETWEEN ? AND ?
            ORDER BY date, check_in_time
        """, (start_date, end_date))
        return self.cursor.fetchall()

    def get_user_attendance(self, employee_id: str, month: str | None = None) -> list:
        """Get attendance history for a specific user."""
        if month:
            self.cursor.execute("""
                SELECT date, check_in_time, check_out_time, status
                FROM attendance WHERE employee_id = ? AND date LIKE ?
                ORDER BY date
            """, (employee_id, f"{month}%"))
        else:
            self.cursor.execute("""
                SELECT date, check_in_time, check_out_time, status
                FROM attendance WHERE employee_id = ?
                ORDER BY date DESC LIMIT 30
            """, (employee_id,))
        return self.cursor.fetchall()

    def get_all_users(self) -> list:
        """Get all registered users from database."""
        self.cursor.execute(
            "SELECT employee_id, name, department, email FROM users WHERE is_active = 1"
        )
        return self.cursor.fetchall()

    def delete_user(self, employee_id: str) -> bool:
        """Soft delete a user (set is_active=0)."""
        self.cursor.execute(
            "UPDATE users SET is_active = 0 WHERE employee_id = ?", (employee_id,)
        )
        self.conn.commit()
        return self.cursor.rowcount > 0

    def close(self) -> None:
        """Close database connection."""
        self.conn.close()
