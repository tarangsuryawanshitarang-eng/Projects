"""Download required models for face detection and liveness check."""

import os
import urllib.request
import bz2

MODELS_DIR = "models"
os.makedirs(MODELS_DIR, exist_ok=True)


def download_file(url: str, dest: str, desc: str = "") -> bool:
    """Download a file from URL to dest."""
    if os.path.exists(dest):
        print(f"  {desc or dest}: already exists")
        return True
    try:
        print(f"  Downloading {desc or url}...")
        urllib.request.urlretrieve(url, dest)
        print(f"  Saved to {dest}")
        return True
    except Exception as e:
        print(f"  Failed: {e}")
        return False


def main():
    print("Downloading models...\n")

    # DNN Face Detector (optional - for Phase 1c)
    prototxt = os.path.join(MODELS_DIR, "deploy.prototxt")
    model = os.path.join(MODELS_DIR, "res10_300x300_ssd_iter_140000.caffemodel")
    download_file(
        "https://raw.githubusercontent.com/opencv/opencv/master/samples/dnn/face_detector/deploy.prototxt",
        prototxt, "deploy.prototxt",
    )
    # Caffe model for DNN face detection (optional)
    download_file(
        "https://github.com/opencv/opencv_3rdparty/raw/dnn_samples_face_detector_20170830/res10_300x300_ssd_iter_140000.caffemodel",
        model, "res10_300x300_ssd_iter_140000.caffemodel",
    )

    # Shape predictor for liveness (blink detection)
    predictor_bz2 = os.path.join(MODELS_DIR, "shape_predictor_68_face_landmarks.dat.bz2")
    predictor_dat = os.path.join(MODELS_DIR, "shape_predictor_68_face_landmarks.dat")

    if not os.path.exists(predictor_dat):
        if download_file(
            "http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2",
            predictor_bz2, "shape_predictor_68_face_landmarks.dat.bz2",
        ):
            try:
                print("  Extracting...")
                with bz2.BZ2File(predictor_bz2, "rb") as src:
                    with open(predictor_dat, "wb") as dst:
                        dst.write(src.read())
                os.remove(predictor_bz2)
                print(f"  Extracted to {predictor_dat}")
            except Exception as e:
                print(f"  Extract failed: {e}")

    print("\nDone. Haar Cascade is included with OpenCV (no download needed).")


if __name__ == "__main__":
    main()
