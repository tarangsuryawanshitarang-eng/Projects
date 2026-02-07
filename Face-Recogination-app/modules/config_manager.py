"""Configuration management for the Face Recognition Attendance System."""

import json
import os

DEFAULT_CONFIG = {
    "camera": {"index": 0, "width": 640, "height": 480, "fps": 30},
    "recognition": {
        "threshold": 0.5,
        "model": "hog",
        "frame_skip": 3,
        "resize_scale": 0.5,
        "min_face_size": 50,
    },
    "attendance": {"cooldown_seconds": 30},
    "liveness": {"enabled": False, "method": "blink", "blink_count": 2, "timeout": 10},
    "database": {"path": "data/attendance.db"},
    "paths": {
        "faces_dir": "data/faces",
        "encodings_file": "data/encodings.pkl",
        "logs_dir": "logs",
        "exports_dir": "exports",
    },
}


def load_config(config_path: str = "config.json") -> dict:
    """Load configuration from JSON file."""
    if os.path.exists(config_path):
        with open(config_path, "r") as f:
            config = json.load(f)
        # Merge with defaults for any missing keys
        merged = _deep_merge(DEFAULT_CONFIG.copy(), config)
        return merged
    return DEFAULT_CONFIG.copy()


def _deep_merge(base: dict, override: dict) -> dict:
    """Deep merge override into base."""
    result = base.copy()
    for key, value in override.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = _deep_merge(result[key], value)
        else:
            result[key] = value
    return result


def save_config(config: dict, config_path: str = "config.json") -> None:
    """Save configuration to JSON file."""
    with open(config_path, "w") as f:
        json.dump(config, f, indent=2)


def get_path(config: dict, key: str) -> str:
    """Get a path from config, ensuring directory exists if needed."""
    paths = config.get("paths", {})
    path = paths.get(key, "")
    if key in ("faces_dir", "logs_dir", "exports_dir") and path:
        os.makedirs(path, exist_ok=True)
    return path
