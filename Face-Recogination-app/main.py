"""
Face Recognition + Attendance System
CLI entry point.
"""

import argparse
import sys
from datetime import datetime, timedelta

import cv2
import face_recognition
import numpy as np

from modules.config_manager import load_config, get_path
from modules.face_recognizer import load_encodings, recognize_frame
from modules.face_register import register_new_user, check_user_exists
from modules.attendance_manager import AttendanceManager
from modules.report_generator import print_today_report, export_to_csv, export_to_excel
from modules.liveness import liveness_check_blink


def run_attendance_system(config: dict, liveness_enabled: bool = False) -> None:
    """Main attendance system — recognize faces and log attendance."""
    encodings_file = config["paths"].get("encodings_file", "data/encodings.pkl")
    known_data = load_encodings(encodings_file)
    if known_data is None:
        return

    db_path = config["database"].get("path", "data/attendance.db")
    cooldown = config["attendance"].get("cooldown_seconds", 30)
    attendance = AttendanceManager(db_path=db_path, cooldown=cooldown)

    threshold = config["recognition"].get("threshold", 0.5)
    frame_skip = config["recognition"].get("frame_skip", 3)
    resize_scale = config["recognition"].get("resize_scale", 0.5)
    camera_index = config["camera"].get("index", 0)

    cap = cv2.VideoCapture(camera_index)
    if not cap.isOpened():
        print("❌ Cannot access webcam.")
        return

    print("\n" + "=" * 50)
    print("📋 FACE RECOGNITION ATTENDANCE SYSTEM")
    print("=" * 50)
    print("Press 'Q' to quit | 'R' = today's report | 'A' = add user")
    print("=" * 50 + "\n")

    frame_count = 0
    recognized_info = []
    notifications = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        display_frame = frame.copy()
        frame_count += 1

        if frame_count % frame_skip == 0:
            results = recognize_frame(frame, known_data, threshold, resize_scale)
            recognized_info = results

            for r in results:
                if r["name"] != "Unknown":
                    status = attendance.mark_attendance(
                        r["id"], r["name"], r["confidence"]
                    )
                    if status == "CHECK-IN":
                        notifications.append((
                            f"Welcome, {r['name']}! ✅",
                            (0, 255, 0),
                            datetime.now() + timedelta(seconds=3),
                        ))
                    elif status == "CHECK-OUT":
                        notifications.append((
                            f"Goodbye, {r['name']}! 👋",
                            (255, 165, 0),
                            datetime.now() + timedelta(seconds=3),
                        ))

        for info in recognized_info:
            top, right, bottom, left = info["location"]
            name = info["name"]
            conf = info["confidence"]
            color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
            cv2.rectangle(display_frame, (left, top), (right, bottom), color, 2)
            label = f"{name} ({conf:.0f}%)" if name != "Unknown" else "Unknown"
            cv2.rectangle(display_frame, (left, bottom - 30), (right, bottom), color, cv2.FILLED)
            cv2.putText(
                display_frame, label, (left + 6, bottom - 8),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1
            )

        cv2.rectangle(display_frame, (0, 0), (display_frame.shape[1], 45), (50, 50, 50), cv2.FILLED)
        cv2.putText(
            display_frame, "Face Recognition Attendance System",
            (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2
        )
        cv2.putText(
            display_frame, datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            (display_frame.shape[1] - 250, 30), cv2.FONT_HERSHEY_SIMPLEX,
            0.6, (200, 200, 200), 1
        )

        now = datetime.now()
        notifications = [(m, c, e) for m, c, e in notifications if e > now]
        for i, (msg, color, _) in enumerate(notifications):
            y_pos = 70 + i * 35
            cv2.putText(display_frame, msg, (10, y_pos),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        cv2.imshow("Attendance System", display_frame)
        key = cv2.waitKey(1) & 0xFF

        if key == ord("q"):
            break
        elif key == ord("r"):
            print_today_report(attendance)
        elif key == ord("a"):
            cap.release()
            cv2.destroyAllWindows()
            _do_register(config)
            known_data = load_encodings(encodings_file)
            if known_data:
                cap = cv2.VideoCapture(camera_index)
            else:
                break

    cap.release()
    cv2.destroyAllWindows()
    attendance.close()
    print("\n📋 System closed. Final report:")
    print_today_report(attendance)


def _do_register(config: dict) -> None:
    """Run registration flow."""
    db_path = config["database"].get("path", "data/attendance.db")
    faces_dir = config["paths"].get("faces_dir", "data/faces")
    encodings_file = config["paths"].get("encodings_file", "data/encodings.pkl")

    print("\n👤 Register New User")
    print("=" * 40)
    employee_id = input("Employee ID: ").strip()
    name = input("Full Name: ").strip()
    department = input("Department: ").strip()
    email = input("Email: ").strip()

    def add_user(emp_id: str, nm: str, dept: str, eml: str):
        att = AttendanceManager(db_path=db_path)
        att.add_user(emp_id, nm, dept, eml)
        att.close()

    overwrite = False
    if check_user_exists(encodings_file, employee_id):
        if input("User exists. Overwrite? (y/n): ").lower() == "y":
            overwrite = True
        else:
            return

    register_new_user(
        employee_id=employee_id,
        name=name,
        department=department,
        email=email,
        faces_dir=faces_dir,
        encodings_file=encodings_file,
        add_user_db=lambda i, n, d, e: add_user(i, n, d, e),
        overwrite=overwrite,
    )


def cmd_register(args: argparse.Namespace, config: dict) -> None:
    """Handle register command."""
    db_path = config["database"].get("path", "data/attendance.db")
    faces_dir = config["paths"].get("faces_dir", "data/faces")
    encodings_file = config["paths"].get("encodings_file", "data/encodings.pkl")

    employee_id = args.id or input("Employee ID: ").strip()
    name = args.name or input("Full Name: ").strip()
    department = args.department or input("Department: ").strip()
    email = args.email or input("Email: ").strip()
    num_images = getattr(args, "images", 5) or 5

    def add_user(emp_id: str, nm: str, dept: str, eml: str):
        att = AttendanceManager(db_path=db_path)
        att.add_user(emp_id, nm, dept, eml)
        att.close()

    overwrite = check_user_exists(encodings_file, employee_id)
    if overwrite:
        overwrite = input("User exists. Overwrite? (y/n): ").lower() == "y"

    register_new_user(
        employee_id=employee_id,
        name=name,
        department=department,
        email=email,
        faces_dir=faces_dir,
        encodings_file=encodings_file,
        num_captures=num_images,
        add_user_db=lambda i, n, d, e: add_user(i, n, d, e),
        overwrite=overwrite,
    )


def cmd_attend(args: argparse.Namespace, config: dict) -> None:
    """Handle attend command."""
    if getattr(args, "liveness", False):
        blink_count = config.get("liveness", {}).get("blink_count", 2)
        timeout = config.get("liveness", {}).get("timeout", 10)
        if not liveness_check_blink(blink_required=blink_count, timeout=timeout):
            print("❌ Liveness check failed. Attendance system not started.")
            return
    config["camera"]["index"] = getattr(args, "camera", 0) or 0
    config["recognition"]["threshold"] = getattr(args, "threshold", 0.5) or 0.5
    config["attendance"]["cooldown_seconds"] = getattr(args, "cooldown", 30) or 30
    run_attendance_system(config, liveness_enabled=getattr(args, "liveness", False))


def cmd_report(args: argparse.Namespace, config: dict) -> None:
    """Handle report command."""
    db_path = config["database"].get("path", "data/attendance.db")
    att = AttendanceManager(db_path=db_path)

    if getattr(args, "today", False):
        records = att.get_today_attendance()
        print_today_report(att)
    elif getattr(args, "date", None):
        records = att.get_attendance_by_date(args.date)
        print(f"\n📋 Attendance — {args.date}")
        for r in records:
            print(f"  {r[0]} | {r[1]} | In: {r[2]} | Out: {r[3] or '---'} | {r[4]}")
    elif getattr(args, "from_date", None) and getattr(args, "to_date", None):
        records = att.get_attendance_report(args.from_date, args.to_date)
        print(f"\n📋 Attendance {args.from_date} to {args.to_date}")
        for r in records:
            print(f"  {r[0]} | {r[1]} | {r[2]} | {r[3]} | {r[4] or '---'} | {r[5]}")
    elif getattr(args, "user", None):
        records = att.get_user_attendance(args.user)
        print(f"\n📋 Attendance for user {args.user}")
        for r in records:
            print(f"  {r[0]} | In: {r[1]} | Out: {r[2] or '---'} | {r[3]}")
    else:
        print_today_report(att)

    att.close()


def cmd_export(args: argparse.Namespace, config: dict) -> None:
    """Handle export command."""
    db_path = config["database"].get("path", "data/attendance.db")
    exports_dir = config["paths"].get("exports_dir", "exports")
    att = AttendanceManager(db_path=db_path)

    fmt = getattr(args, "format", "csv") or "csv"
    out = getattr(args, "output", None)
    from_d = getattr(args, "from_date", None)
    to_d = getattr(args, "to_date", None)

    today = datetime.now().strftime("%Y-%m-%d")
    if not out:
        out = f"{exports_dir}/attendance_{today}.{fmt}"

    import os
    os.makedirs(exports_dir, exist_ok=True)

    if fmt == "excel":
        export_to_excel(att, out, from_d or today, to_d or today)
    else:
        export_to_csv(att, out, from_d, to_d)

    att.close()


def cmd_users(args: argparse.Namespace, config: dict) -> None:
    """Handle users command."""
    db_path = config["database"].get("path", "data/attendance.db")
    att = AttendanceManager(db_path=db_path)

    if getattr(args, "list", False):
        users = att.get_all_users()
        print("\n📋 Registered Users")
        for u in users:
            print(f"  {u[0]} | {u[1]} | {u[2]} | {u[3]}")
    elif getattr(args, "delete", None):
        if att.delete_user(args.delete):
            print(f"✅ User {args.delete} deleted.")
        else:
            print(f"❌ User {args.delete} not found.")
    else:
        users = att.get_all_users()
        for u in users:
            print(f"  {u[0]} | {u[1]}")

    att.close()


def cmd_config(args: argparse.Namespace, config: dict) -> None:
    """Handle config command."""
    from modules.config_manager import save_config

    if getattr(args, "show", False):
        import json
        print(json.dumps(config, indent=2))
    if getattr(args, "threshold", None) is not None:
        config["recognition"]["threshold"] = args.threshold
    if getattr(args, "camera", None) is not None:
        config["camera"]["index"] = args.camera
    if getattr(args, "cooldown", None) is not None:
        config["attendance"]["cooldown_seconds"] = args.cooldown
    save_config(config)
    print("✅ Config updated.")


def cmd_diagnose(args: argparse.Namespace, config: dict) -> None:
    """Run system diagnostics."""
    print("\n🔧 System Diagnostics")
    print("=" * 40)
    try:
        import cv2
        cap = cv2.VideoCapture(config["camera"].get("index", 0))
        ok = cap.isOpened()
        cap.release()
        print(f"  Camera: {'✅ OK' if ok else '❌ Not accessible'}")
    except Exception as e:
        print(f"  Camera: ❌ {e}")

    try:
        import face_recognition
        print("  face_recognition: ✅ OK")
    except ImportError as e:
        print(f"  face_recognition: ❌ {e}")

    enc_file = config["paths"].get("encodings_file", "data/encodings.pkl")
    import os
    print(f"  Encodings file: {'✅ Exists' if os.path.exists(enc_file) else '⚠️ Not found'}")

    db_path = config["database"].get("path", "data/attendance.db")
    print(f"  Database: {'✅ Exists' if os.path.exists(db_path) else '⚠️ Not found'}")
    print("=" * 40 + "\n")


def cmd_detect(args: argparse.Namespace, config: dict) -> None:
    """Run basic face detection demo."""
    from modules.face_detector import run_haar_detection_demo
    run_haar_detection_demo()


def create_parser() -> argparse.ArgumentParser:
    """Create CLI argument parser."""
    parser = argparse.ArgumentParser(
        description="🎯 Face Recognition Attendance System",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py register
  python main.py attend
  python main.py attend --liveness
  python main.py report --today
  python main.py report --from 2025-03-01 --to 2025-03-31
  python main.py export --format csv --output report.csv
  python main.py users --list
  python main.py detect
        """,
    )

    sub = parser.add_subparsers(dest="command", help="Commands")

    reg = sub.add_parser("register", help="Register a new user")
    reg.add_argument("--id", help="Employee ID")
    reg.add_argument("--name", help="Full name")
    reg.add_argument("--department", help="Department")
    reg.add_argument("--email", help="Email")
    reg.add_argument("--images", type=int, default=5, help="Number of face images")

    att = sub.add_parser("attend", help="Start attendance system")
    att.add_argument("--camera", type=int, default=0)
    att.add_argument("--threshold", type=float, default=0.5)
    att.add_argument("--liveness", action="store_true")
    att.add_argument("--cooldown", type=int, default=30)

    rep = sub.add_parser("report", help="View attendance reports")
    rep.add_argument("--today", action="store_true")
    rep.add_argument("--date", help="Date (YYYY-MM-DD)")
    rep.add_argument("--from", dest="from_date", help="Start date")
    rep.add_argument("--to", dest="to_date", help="End date")
    rep.add_argument("--user", help="User ID")

    exp = sub.add_parser("export", help="Export attendance")
    exp.add_argument("--format", choices=["csv", "excel"], default="csv")
    exp.add_argument("--output", "-o", help="Output file")
    exp.add_argument("--from", dest="from_date", help="Start date")
    exp.add_argument("--to", dest="to_date", help="End date")

    usr = sub.add_parser("users", help="Manage users")
    usr.add_argument("--list", action="store_true")
    usr.add_argument("--delete", help="Delete user by ID")

    cfg = sub.add_parser("config", help="Configuration")
    cfg.add_argument("--show", action="store_true")
    cfg.add_argument("--threshold", type=float)
    cfg.add_argument("--camera", type=int)
    cfg.add_argument("--cooldown", type=int)

    sub.add_parser("diagnose", help="Run diagnostics")
    sub.add_parser("detect", help="Run face detection demo")

    return parser


def main() -> None:
    """Entry point."""
    config = load_config()
    parser = create_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    handlers = {
        "register": cmd_register,
        "attend": cmd_attend,
        "report": cmd_report,
        "export": cmd_export,
        "users": cmd_users,
        "config": cmd_config,
        "diagnose": cmd_diagnose,
        "detect": cmd_detect,
    }
    h = handlers.get(args.command)
    if h:
        h(args, config)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
