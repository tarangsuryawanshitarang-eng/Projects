"""Quick Start - Minimal face recognition + attendance in ~10 minutes."""

import os
import pickle
from datetime import datetime

DATA_FILE = "data/face_data.pkl"


def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "rb") as f:
            return pickle.load(f)
    return {"encodings": [], "names": []}


def save_data(data):
    os.makedirs(os.path.dirname(DATA_FILE) or ".", exist_ok=True)
    with open(DATA_FILE, "wb") as f:
        pickle.dump(data, f)


def register():
    import cv2
    import face_recognition

    name = input("Enter name: ").strip()
    if not name:
        print("Name required.")
        return

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Cannot access webcam.")
        return

    print("Press SPACE to capture, Q to quit")

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        cv2.imshow("Register", frame)
        key = cv2.waitKey(1)

        if key == 32:  # SPACE
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            encs = face_recognition.face_encodings(rgb)
            if encs:
                data = load_data()
                data["encodings"].append(encs[0])
                data["names"].append(name)
                save_data(data)
                print(f"Registered: {name}")
                break
            else:
                print("No face found, try again")

        elif key == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()


def attend():
    import cv2
    import face_recognition
    import numpy as np

    data = load_data()
    if not data["encodings"]:
        print("No users registered! Run register first.")
        return

    marked = set()
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Cannot access webcam.")
        return

    print("Press Q to quit and see report")

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        locs = face_recognition.face_locations(rgb)
        encs = face_recognition.face_encodings(rgb, locs)

        for enc, (t, r, b, l) in zip(encs, locs):
            dists = face_recognition.face_distance(data["encodings"], enc)
            idx = int(np.argmin(dists))

            if dists[idx] < 0.5:
                name = data["names"][idx]
                color = (0, 255, 0)
                if name not in marked:
                    marked.add(name)
                    time_str = datetime.now().strftime("%H:%M:%S")
                    print(f"{name} — Present at {time_str}")
            else:
                name = "Unknown"
                color = (0, 0, 255)

            cv2.rectangle(frame, (l, t), (r, b), color, 2)
            cv2.putText(frame, name, (l, t - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        cv2.imshow("Attendance", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
    print(f"\nPresent: {', '.join(marked) if marked else 'Nobody'}")


if __name__ == "__main__":
    print("1. Register  2. Attendance")
    choice = input("Choose (1/2): ").strip()
    if choice == "1":
        register()
    elif choice == "2":
        attend()
    else:
        print("Invalid choice.")
