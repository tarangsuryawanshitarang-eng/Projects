"""Anti-spoofing / liveness detection using blink detection."""

import cv2
from datetime import datetime
from typing import Optional, Callable

# Optional dlib for blink detection - gracefully degrade if not available
try:
    import dlib
    from scipy.spatial import distance as dist

    DLIB_AVAILABLE = True
except ImportError:
    DLIB_AVAILABLE = False


EAR_THRESHOLD = 0.25
CONSEC_FRAMES_BLINK = 3


def eye_aspect_ratio(eye: list) -> float:
    """Calculate Eye Aspect Ratio (EAR)."""
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])
    C = dist.euclidean(eye[0], eye[3])
    return (A + B) / (2.0 * C) if C > 0 else 0


def liveness_check_blink(
    predictor_path: str = "models/shape_predictor_68_face_landmarks.dat",
    blink_required: int = 2,
    timeout: int = 10,
) -> bool:
    """
    Liveness check: Require user to blink naturally.
    Returns True if liveness confirmed, False if spoofing suspected or dlib unavailable.
    """
    if not DLIB_AVAILABLE:
        print("⚠️ dlib/scipy not installed. Skipping liveness check.")
        return True  # Allow without liveness if dependencies missing

    if not __import__("os").path.exists(predictor_path):
        print(f"⚠️ Shape predictor not found at {predictor_path}. Skipping liveness check.")
        return True

    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor(predictor_path)

    LEFT_EYE = list(range(42, 48))
    RIGHT_EYE = list(range(36, 42))

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Cannot access webcam for liveness check.")
        return False

    blink_count = 0
    frame_counter = 0
    start_time = datetime.now()

    print(f"👁️ Liveness Check: Please blink {blink_required} times")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        elapsed = (datetime.now() - start_time).total_seconds()
        if elapsed > timeout:
            print("⏰ Liveness check timed out.")
            cap.release()
            cv2.destroyAllWindows()
            return False

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = detector(gray)

        for face in faces:
            landmarks = predictor(gray, face)
            left_eye = [(landmarks.part(i).x, landmarks.part(i).y) for i in LEFT_EYE]
            right_eye = [(landmarks.part(i).x, landmarks.part(i).y) for i in RIGHT_EYE]

            left_ear = eye_aspect_ratio(left_eye)
            right_ear = eye_aspect_ratio(right_eye)
            avg_ear = (left_ear + right_ear) / 2.0

            if avg_ear < EAR_THRESHOLD:
                frame_counter += 1
            else:
                if frame_counter >= CONSEC_FRAMES_BLINK:
                    blink_count += 1
                    print(f"   👁️ Blink detected! ({blink_count}/{blink_required})")
                frame_counter = 0

            cv2.putText(frame, f"Blinks: {blink_count}/{blink_required}",
                        (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            cv2.putText(frame, f"EAR: {avg_ear:.2f}",
                        (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

        cv2.putText(frame, f"Time: {timeout - int(elapsed)}s",
                    (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)

        cv2.imshow("Liveness Check", frame)

        if blink_count >= blink_required:
            print("✅ Liveness confirmed!")
            cap.release()
            cv2.destroyAllWindows()
            return True

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
    return False
