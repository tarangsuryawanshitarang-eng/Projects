"""Face registration and enrollment."""

import cv2
import face_recognition
import os
import pickle
import numpy as np
from typing import Callable | None


def check_user_exists(encodings_file: str, employee_id: str) -> bool:
    """Check if a user is already registered."""
    if not os.path.exists(encodings_file):
        return False
    with open(encodings_file, "rb") as f:
        data = pickle.load(f)
    return employee_id in data.get("ids", [])


def save_encoding(
    encodings_file: str,
    employee_id: str,
    name: str,
    encodings: list,
    ids: list | None = None,
    names: list | None = None,
) -> None:
    """Save face encodings to pickle file."""
    if os.path.exists(encodings_file):
        with open(encodings_file, "rb") as f:
            data = pickle.load(f)
    else:
        data = {"encodings": [], "ids": [], "names": []}

    for encoding in encodings:
        data["encodings"].append(encoding)
        data["ids"].append(employee_id)
        data["names"].append(name)

    os.makedirs(os.path.dirname(encodings_file) or ".", exist_ok=True)
    with open(encodings_file, "wb") as f:
        pickle.dump(data, f)


def register_new_user(
    employee_id: str,
    name: str,
    department: str = "",
    email: str = "",
    faces_dir: str = "data/faces",
    encodings_file: str = "data/encodings.pkl",
    num_captures: int = 5,
    min_face_size: int = 100,
    add_user_db: Callable | None = None,
    overwrite: bool = False,
) -> bool:
    """Register a new user by capturing face images and encodings.
    
    Returns True if successful.
    """
    if not employee_id or not name:
        print("❌ Employee ID and Name are required.")
        return False

    if check_user_exists(encodings_file, employee_id) and not overwrite:
        print(f"❌ User with ID '{employee_id}' already exists.")
        return False

    user_dir = os.path.join(faces_dir, employee_id)
    os.makedirs(user_dir, exist_ok=True)

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Error: Cannot access webcam.")
        return False

    captured_encodings = []
    capture_count = 0
    instructions = [
        "Look straight at the camera",
        "Turn head slightly LEFT",
        "Turn head slightly RIGHT",
        "Tilt head slightly UP",
        "Tilt head slightly DOWN",
    ]

    print(f"\n📷 Capturing {num_captures} images. Press 'C' to capture, 'Q' to quit.")

    while capture_count < num_captures:
        ret, frame = cap.read()
        if not ret:
            break

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_frame)
        display_frame = frame.copy()

        instruction = instructions[min(capture_count, len(instructions) - 1)]
        cv2.putText(
            display_frame, f"Step {capture_count + 1}/{num_captures}: {instruction}",
            (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2
        )

        if len(face_locations) == 0:
            cv2.putText(display_frame, "No face detected", (10, 60),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        elif len(face_locations) > 1:
            cv2.putText(display_frame, "Multiple faces! Only 1 allowed.", (10, 60),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        elif len(face_locations) == 1:
            top, right, bottom, left = face_locations[0]
            face_width = right - left
            face_height = bottom - top
            cv2.rectangle(display_frame, (left, top), (right, bottom), (0, 255, 0), 2)
            if face_width < min_face_size or face_height < min_face_size:
                cv2.putText(display_frame, "Move closer to camera", (10, 60),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 165, 255), 2)
            else:
                cv2.putText(display_frame, "Ready! Press 'C' to capture", (10, 60),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        cv2.putText(
            display_frame, f"Captured: {capture_count}/{num_captures}",
            (10, display_frame.shape[0] - 20), cv2.FONT_HERSHEY_SIMPLEX,
            0.6, (255, 255, 255), 2
        )

        cv2.imshow("Register Face", display_frame)
        key = cv2.waitKey(1) & 0xFF

        if key == ord("c") and len(face_locations) == 1:
            top, right, bottom, left = face_locations[0]
            face_width = right - left
            if face_width >= min_face_size:
                encodings = face_recognition.face_encodings(rgb_frame, face_locations)
                if encodings:
                    captured_encodings.append(encodings[0])
                    img_path = os.path.join(user_dir, f"face_{capture_count + 1}.jpg")
                    cv2.imwrite(img_path, frame)
                    capture_count += 1
                    print(f"   ✅ Captured {capture_count}/{num_captures}")
                    flash = np.ones_like(frame) * 255
                    cv2.imshow("Register Face", flash.astype(np.uint8))
                    cv2.waitKey(200)
        elif key == ord("q"):
            print("Registration cancelled.")
            cap.release()
            cv2.destroyAllWindows()
            return False

    cap.release()
    cv2.destroyAllWindows()

    if not captured_encodings:
        print("❌ Registration failed. No face encodings captured.")
        return False

    save_encoding(encodings_file, employee_id, name, captured_encodings)
    if add_user_db:
        add_user_db(employee_id, name, department, email)

    print(f"\n✅ User '{name}' registered successfully!")
    print(f"   ID: {employee_id}, Images: {len(captured_encodings)}")
    return True
