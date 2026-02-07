"""Face recognition engine."""

import os
import cv2
import pickle
import face_recognition
import numpy as np
from typing import Any, List


def load_encodings(encodings_file: str) -> dict | None:
    """Load registered face encodings from file."""
    if not os.path.exists(encodings_file):
        print("⚠️ No registered users found. Please register users first.")
        return None

    with open(encodings_file, "rb") as f:
        data = pickle.load(f)

    if not data.get("encodings"):
        print("⚠️ Encodings file is empty.")
        return None

    num_users = len(set(data.get("ids", [])))
    print(f"📂 Loaded {len(data['encodings'])} encodings for {num_users} users")
    return data


def recognize_frame(
    frame: np.ndarray,
    known_data: dict,
    threshold: float = 0.5,
    resize_scale: float = 0.5,
) -> List[dict]:
    """
    Recognize faces in a frame.
    Returns list of dicts with: name, id, confidence, location (top, right, bottom, left).
    """
    small_frame = cv2.resize(frame, (0, 0), fx=resize_scale, fy=resize_scale)
    rgb_small = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_small)
    face_encodings = face_recognition.face_encodings(rgb_small, face_locations)

    known_encodings = known_data["encodings"]
    known_ids = known_data["ids"]
    known_names = known_data["names"]

    results = []
    scale = int(1 / resize_scale)

    for encoding, (top, right, bottom, left) in zip(face_encodings, face_locations):
        distances = face_recognition.face_distance(known_encodings, encoding)
        name = "Unknown"
        employee_id = "N/A"
        confidence = 0.0

        if len(distances) > 0:
            best_idx = np.argmin(distances)
            best_dist = distances[best_idx]
            if best_dist < threshold:
                name = known_names[best_idx]
                employee_id = known_ids[best_idx]
                confidence = (1 - best_dist) * 100

        results.append({
            "name": name,
            "id": employee_id,
            "confidence": confidence,
            "location": (
                top * scale, right * scale,
                bottom * scale, left * scale,
            ),
        })

    return results
