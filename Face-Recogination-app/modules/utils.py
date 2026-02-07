"""Helper utilities for the Face Recognition Attendance System."""

import os


def ensure_dirs(*paths: str) -> None:
    """Ensure directories exist."""
    for path in paths:
        if path:
            os.makedirs(path, exist_ok=True)
