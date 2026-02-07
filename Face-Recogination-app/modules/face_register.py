"""Face registration using OpenCV Haar + LBPH (no dlib/face_recognition)."""

import cv2
import os
import json
import numpy as np
from typing import Callable, Optional

FACE_SIZE = (200, 200)
HAAR_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"


def _get_face_cascade():
    cascade = cv2.CascadeClassifier(HAAR_PATH)
    if cascade.empty():
        raise RuntimeError("Could not load Haar Cascade.")
    return cascade


def check_user_exists(encodings_file: str, employee_id: str) -> bool:
    """Check if a user is already registered."""
    labels_path = encodings_file.replace(".pkl", "_labels.json")
    if not os.path.exists(labels_path):
        labels_path = "data/face_labels.json"
    if not os.path.exists(labels_path):
        return False
    with open(labels_path, "r") as f:
        data = json.load(f)
    for entry in data.get("users", []):
        if entry.get("employee_id") == employee_id:
            return True
    return False


def _detect_face_haar(frame):
    """Return (x, y, w, h) or None."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    cascade = _get_face_cascade()
    faces = cascade.detectMultiScale(gray, 1.1, 5, minSize=(50, 50))
    if len(faces) == 0:
        return None
    if len(faces) > 1:
        return None  # Multiple faces
    return tuple(int(x) for x in faces[0])


def _prepare_face(frame, box):
    """Crop, grayscale, resize face for LBPH."""
    x, y, w, h = box
    face_img = frame[y : y + h, x : x + w]
    gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
    return cv2.resize(gray, FACE_SIZE)


def _load_all_faces_and_labels(faces_dir: str, labels_file: str, exclude_employee_id: str = ""):
    """Load all registered faces and labels. Returns (faces, labels, id_to_info)."""
    faces = []
    labels = []
    id_to_info = {}  # label_idx -> (employee_id, name)
    if not os.path.exists(labels_file):
        return faces, labels, id_to_info
    with open(labels_file, "r") as f:
        data = json.load(f)
    label_idx = 0
    for user in data.get("users", []):
        emp_id = user["employee_id"]
        if emp_id == exclude_employee_id:
            continue
        name = user["name"]
        id_to_info[label_idx] = (emp_id, name)
        user_dir = os.path.join(faces_dir, emp_id)
        if not os.path.isdir(user_dir):
            continue
        for fn in os.listdir(user_dir):
            if fn.lower().endswith((".jpg", ".jpeg", ".png")):
                path = os.path.join(user_dir, fn)
                img = cv2.imread(path)
                if img is None:
                    continue
                box = _detect_face_haar(img)
                if box is None:
                    continue
                face = _prepare_face(img, box)
                faces.append(face)
                labels.append(label_idx)
        label_idx += 1
    return faces, labels, id_to_info


def _save_model(model_path: str, labels_path: str, recognizer, id_to_info: dict) -> None:
    os.makedirs(os.path.dirname(model_path) or ".", exist_ok=True)
    recognizer.write(model_path)
    users = [
        {"employee_id": emp_id, "name": name, "label": idx}
        for idx, (emp_id, name) in id_to_info.items()
    ]
    with open(labels_path, "w") as f:
        json.dump({"users": users}, f, indent=2)


def register_new_user(
    employee_id: str,
    name: str,
    department: str = "",
    email: str = "",
    faces_dir: str = "data/faces",
    encodings_file: str = "data/encodings.pkl",
    num_captures: int = 5,
    min_face_size: int = 100,
    add_user_db: Optional[Callable] = None,
    overwrite: bool = False,
) -> bool:
    """Register a new user. Uses encodings_file path to derive model/labels paths for compat."""
    model_path = encodings_file.replace(".pkl", "_model.yml")
    labels_path = encodings_file.replace(".pkl", "_labels.json")
    if "encodings" in model_path:
        model_path = "data/face_model.yml"
        labels_path = "data/face_labels.json"

    if not employee_id or not name:
        print("Employee ID and Name are required.")
        return False

    if check_user_exists(encodings_file, employee_id) and not overwrite:
        print(f"User with ID '{employee_id}' already exists.")
        return False

    user_dir = os.path.join(faces_dir, employee_id)
    os.makedirs(user_dir, exist_ok=True)

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Cannot access webcam.")
        return False

    cascade = _get_face_cascade()
    captured_faces = []
    capture_count = 0
    instructions = [
        "Look straight at the camera",
        "Turn head slightly LEFT",
        "Turn head slightly RIGHT",
        "Tilt head slightly UP",
        "Tilt head slightly DOWN",
    ]

    print(f"\nCapturing {num_captures} images. Press 'C' to capture, 'Q' to quit.")

    while capture_count < num_captures:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        face_boxes = cascade.detectMultiScale(gray, 1.1, 5, minSize=(min_face_size, min_face_size))
        display_frame = frame.copy()

        instruction = instructions[min(capture_count, len(instructions) - 1)]
        cv2.putText(
            display_frame, f"Step {capture_count + 1}/{num_captures}: {instruction}",
            (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2
        )

        if len(face_boxes) == 0:
            cv2.putText(display_frame, "No face detected", (10, 60),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        elif len(face_boxes) > 1:
            cv2.putText(display_frame, "Multiple faces! Only 1 allowed.", (10, 60),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        else:
            x, y, w, h = face_boxes[0]
            cv2.rectangle(display_frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(display_frame, "Ready! Press 'C' to capture", (10, 60),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        cv2.putText(display_frame, f"Captured: {capture_count}/{num_captures}",
                    (10, display_frame.shape[0] - 20), cv2.FONT_HERSHEY_SIMPLEX,
                    0.6, (255, 255, 255), 2)

        cv2.imshow("Register Face", display_frame)
        key = cv2.waitKey(1) & 0xFF

        if key == ord("c") and len(face_boxes) == 1:
            x, y, w, h = face_boxes[0]
            if w >= min_face_size:
                face_img = _prepare_face(frame, (x, y, w, h))
                captured_faces.append(face_img)
                img_path = os.path.join(user_dir, f"face_{capture_count + 1}.jpg")
                cv2.imwrite(img_path, frame)
                capture_count += 1
                print(f"   Captured {capture_count}/{num_captures}")
                flash = np.ones_like(frame) * 255
                cv2.imshow("Register Face", flash.astype(np.uint8))
                cv2.waitKey(200)
        elif key == ord("q"):
            cap.release()
            cv2.destroyAllWindows()
            return False

    cap.release()
    cv2.destroyAllWindows()

    if not captured_faces:
        print("Registration failed. No face images captured.")
        return False

    try:
        recognizer = cv2.face.LBPHFaceRecognizer_create()
    except AttributeError:
        recognizer = cv2.face_LBPHFaceRecognizer.create()

    model_path = encodings_file.replace(".pkl", "_model.yml")
    labels_path = encodings_file.replace(".pkl", "_labels.json")
    if "encodings" in model_path:
        model_path = "data/face_model.yml"
        labels_path = "data/face_labels.json"

    faces, labels, id_to_info = _load_all_faces_and_labels(
        faces_dir, labels_path,
        exclude_employee_id=employee_id if overwrite else ""
    )

    new_label = len(id_to_info)
    id_to_info[new_label] = (employee_id, name)
    for f in captured_faces:
        faces.append(f)
        labels.append(new_label)

    if not faces:
        print("No faces to train.")
        return False

    np_faces = np.array(faces)
    np_labels = np.array(labels, dtype=np.int32)
    recognizer.train(np_faces, np_labels)
    _save_model(model_path, labels_path, recognizer, id_to_info)

    if add_user_db:
        add_user_db(employee_id, name, department, email)

    print(f"\nUser '{name}' registered successfully! ID: {employee_id}")
    return True
