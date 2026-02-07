"""Face detection using Haar Cascade and optionally DNN."""

import cv2
import numpy as np
import sys


def detect_faces_haar(frame: np.ndarray, scale_factor: float = 1.1, min_neighbors: int = 5, min_size: tuple = (50, 50)) -> list:
    """Detect faces using Haar Cascade classifier.
    
    Returns list of (x, y, w, h) tuples.
    """
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    if face_cascade.empty():
        raise RuntimeError("Could not load Haar Cascade classifier.")

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=scale_factor,
        minNeighbors=min_neighbors,
        minSize=min_size,
        flags=cv2.CASCADE_SCALE_IMAGE,
    )
    return [(int(x), int(y), int(w), int(h)) for (x, y, w, h) in faces]


def detect_faces_dnn(
    frame: np.ndarray,
    prototxt_path: str,
    model_path: str,
    confidence_threshold: float = 0.5,
) -> list:
    """Detect faces using OpenCV DNN module.
    
    Returns list of (x1, y1, x2, y2, confidence) tuples.
    """
    net = cv2.dnn.readNetFromCaffe(prototxt_path, model_path)
    h, w = frame.shape[:2]

    blob = cv2.dnn.blobFromImage(
        cv2.resize(frame, (300, 300)),
        1.0,
        (300, 300),
        (104.0, 177.0, 123.0),
    )
    net.setInput(blob)
    detections = net.forward()

    results = []
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > confidence_threshold:
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (x1, y1, x2, y2) = box.astype("int")
            results.append((x1, y1, x2, y2, float(confidence)))
    return results


def run_haar_detection_demo():
    """Run basic Haar face detection demo from webcam."""
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    if face_cascade.empty():
        print("❌ Error: Could not load Haar Cascade classifier.")
        sys.exit(1)

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Error: Could not access webcam.")
        sys.exit(1)

    print("📷 Camera opened successfully. Press 'Q' to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50)
        )

        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(
                frame, "Face Detected", (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2
            )

        cv2.putText(frame, f"Faces: {len(faces)}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

        cv2.imshow("Face Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("Camera released. Goodbye!")
