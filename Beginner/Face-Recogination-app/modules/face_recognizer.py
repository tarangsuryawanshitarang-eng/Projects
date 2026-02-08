"""Face recognition using OpenCV LBPH (no dlib/face_recognition)."""

import os
import json
import cv2
import numpy as np
from typing import List, Optional

FACE_SIZE = (200, 200)
HAAR_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"


def _get_face_cascade():
    cascade = cv2.CascadeClassifier(HAAR_PATH)
    if cascade.empty():
        raise RuntimeError("Could not load Haar Cascade.")
    return cascade


def _prepare_face(frame, box):
    x, y, w, h = box
    face_img = frame[y : y + h, x : x + w]
    gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
    return cv2.resize(gray, FACE_SIZE)


def load_encodings(encodings_file: str) -> Optional[dict]:
    """Load LBPH model and labels. Returns dict with recognizer, id_to_info."""
    model_path = encodings_file.replace(".pkl", "_model.yml")
    labels_path = encodings_file.replace(".pkl", "_labels.json")
    if "encodings" in model_path:
        model_path = "data/face_model.yml"
        labels_path = "data/face_labels.json"

    if not os.path.exists(model_path) or not os.path.exists(labels_path):
        print("No registered users found. Please register users first.")
        return None

    try:
        recognizer = cv2.face.LBPHFaceRecognizer_create()
    except AttributeError:
        recognizer = cv2.face_LBPHFaceRecognizer.create()
    recognizer.read(model_path)

    with open(labels_path, "r") as f:
        data = json.load(f)
    id_to_info = {}
    for u in data.get("users", []):
        idx = u.get("label", len(id_to_info))
        id_to_info[idx] = (u["employee_id"], u["name"])

    if not id_to_info:
        print("Encodings file is empty.")
        return None

    print(f"Loaded model for {len(id_to_info)} users")
    return {"recognizer": recognizer, "id_to_info": id_to_info}


def recognize_frame(
    frame: np.ndarray,
    known_data: dict,
    threshold: float = 0.5,
    resize_scale: float = 0.5,
    confidence_threshold: int = 80,
) -> List[dict]:
    """
    Recognize faces in a frame.
    LBPH returns (label, confidence) - lower confidence = better match.
    """
    small = cv2.resize(frame, (0, 0), fx=resize_scale, fy=resize_scale)
    gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    cascade = _get_face_cascade()
    face_boxes = cascade.detectMultiScale(gray, 1.1, 5, minSize=(50, 50))

    recognizer = known_data["recognizer"]
    id_to_info = known_data["id_to_info"]
    scale = int(1 / resize_scale)
    results = []

    for (x, y, w, h) in face_boxes:
        face = _prepare_face(small, (x, y, w, h))
        try:
            label, conf = recognizer.predict(face)
        except Exception:
            label, conf = -1, 999

        name = "Unknown"
        employee_id = "N/A"
        confidence_pct = 0.0

        max_conf = 80
        if label in id_to_info and conf < max_conf:
            emp_id, n = id_to_info[label]
            name = n
            employee_id = emp_id
            confidence_pct = max(0, 100 - conf)

        results.append({
            "name": name,
            "id": employee_id,
            "confidence": confidence_pct,
            "location": (
                int(y * scale), int((x + w) * scale),
                int((y + h) * scale), int(x * scale),
            ),
        })

    return results
