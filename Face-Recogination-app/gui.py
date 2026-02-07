"""
Face Recognition Attendance System - GUI
Run with: python gui.py
"""

import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
from PIL import Image, ImageTk
import cv2
import threading
from datetime import datetime

from modules.config_manager import load_config, get_path
from modules.face_recognizer import load_encodings, recognize_frame
from modules.face_register import register_new_user, check_user_exists
from modules.attendance_manager import AttendanceManager
from modules.report_generator import print_today_report


class AttendanceSystemGUI:
    """Main GUI application."""

    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("Face Recognition Attendance System")
        self.root.geometry("1200x750")
        self.root.configure(bg="#1a1a2e")

        self.config = load_config()
        self.is_running = False
        self.cap = None
        self.attendance_manager = AttendanceManager(
            db_path=self.config["database"].get("path", "data/attendance.db"),
            cooldown=self.config["attendance"].get("cooldown_seconds", 30),
        )
        self.known_data = None
        self.frame_count = 0
        self.recognized_info = []
        self.notifications = []
        self.current_img = None

        self.create_widgets()

    def create_widgets(self) -> None:
        header = tk.Frame(self.root, bg="#16213e", height=60)
        header.pack(fill="x")
        header.pack_propagate(False)

        tk.Label(
            header,
            text="Face Recognition Attendance System",
            font=("Segoe UI", 18, "bold"),
            fg="white",
            bg="#16213e",
        ).pack(side="left", padx=20, pady=15)

        self.time_label = tk.Label(
            header, text="", font=("Segoe UI", 12), fg="#a0a0a0", bg="#16213e"
        )
        self.time_label.pack(side="right", padx=20)
        self.update_time()

        main_frame = tk.Frame(self.root, bg="#1a1a2e")
        main_frame.pack(fill="both", expand=True, padx=20, pady=10)

        camera_frame = tk.LabelFrame(
            main_frame,
            text=" Live Camera ",
            font=("Segoe UI", 12, "bold"),
            fg="white",
            bg="#1a1a2e",
        )
        camera_frame.pack(side="left", fill="both", expand=True, padx=(0, 10))

        self.camera_label = tk.Label(camera_frame, bg="black")
        self.camera_label.pack(fill="both", expand=True, padx=5, pady=5)

        self.notification_label = tk.Label(
            camera_frame,
            text="System Ready — Click Start Camera",
            font=("Segoe UI", 11),
            fg="#4ecca3",
            bg="#1a1a2e",
        )
        self.notification_label.pack(pady=5)

        right_frame = tk.Frame(main_frame, bg="#1a1a2e", width=300)
        right_frame.pack(side="right", fill="y")
        right_frame.pack_propagate(False)

        tk.Label(
            right_frame,
            text="Today's Attendance",
            font=("Segoe UI", 12, "bold"),
            fg="white",
            bg="#1a1a2e",
        ).pack(pady=(0, 10))

        columns = ("ID", "Name", "Time")
        self.tree = ttk.Treeview(right_frame, columns=columns, show="headings", height=15)
        for col in columns:
            self.tree.heading(col, text=col)
            self.tree.column(col, width=80)
        self.tree.pack(fill="both", expand=True)

        btn_frame = tk.Frame(self.root, bg="#1a1a2e")
        btn_frame.pack(fill="x", padx=20, pady=10)

        buttons = [
            ("Start Camera", self.toggle_camera, "#4ecca3"),
            ("Register User", self.open_register, "#3282b8"),
            ("Today's Report", self.show_report, "#e94560"),
        ]

        for text, cmd, color in buttons:
            btn = tk.Button(
                btn_frame,
                text=text,
                command=cmd,
                font=("Segoe UI", 11, "bold"),
                bg=color,
                fg="white",
                padx=20,
                pady=8,
                relief="flat",
                cursor="hand2",
            )
            btn.pack(side="left", padx=5)

        self.status_bar = tk.Label(
            self.root,
            text="System Ready — Click Start Camera to begin",
            font=("Segoe UI", 10),
            fg="#a0a0a0",
            bg="#0f3460",
            anchor="w",
            padx=10,
            pady=5,
        )
        self.status_bar.pack(fill="x", side="bottom")

    def toggle_camera(self) -> None:
        if self.is_running:
            self.stop_camera()
        else:
            self.start_camera()

    def start_camera(self) -> None:
        self.known_data = load_encodings(
            self.config["paths"].get("encodings_file", "data/encodings.pkl")
        )
        if self.known_data is None:
            messagebox.showerror("Error", "No registered users. Register users first.")
            return

        self.cap = cv2.VideoCapture(self.config["camera"].get("index", 0))
        if not self.cap.isOpened():
            messagebox.showerror("Error", "Cannot access camera!")
            return

        self.is_running = True
        self.status_bar.config(text="System Active — Camera Running")
        self.notification_label.config(text="Recognizing faces...")
        threading.Thread(target=self.process_frames, daemon=True).start()

    def process_frames(self) -> None:
        threshold = self.config["recognition"].get("threshold", 0.5)
        frame_skip = self.config["recognition"].get("frame_skip", 3)
        resize_scale = self.config["recognition"].get("resize_scale", 0.5)

        while self.is_running and self.cap:
            ret, frame = self.cap.read()
            if not ret:
                break

            self.frame_count += 1
            display_frame = frame.copy()

            if self.frame_count % frame_skip == 0 and self.known_data:
                results = recognize_frame(
                    frame, self.known_data, threshold, resize_scale
                )
                self.recognized_info = results

                for r in results:
                    if r["name"] != "Unknown":
                        status = self.attendance_manager.mark_attendance(
                            r["id"], r["name"], r["confidence"]
                        )
                        if status == "CHECK-IN":
                            self.notifications.append(
                                (f"Welcome, {r['name']}! Checked In", (0, 255, 0))
                        elif status == "CHECK-OUT":
                            self.notifications.append(
                                (f"Goodbye, {r['name']}! Checked Out", (255, 165, 0))
                        self.refresh_attendance_list()

            for info in self.recognized_info:
                top, right, bottom, left = info["location"]
                name = info["name"]
                conf = info["confidence"]
                color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
                cv2.rectangle(display_frame, (left, top), (right, bottom), color, 2)
                label = f"{name} ({conf:.0f}%)" if name != "Unknown" else "Unknown"
                cv2.rectangle(
                    display_frame, (left, bottom - 30), (right, bottom), color, cv2.FILLED
                )
                cv2.putText(
                    display_frame, label, (left + 6, bottom - 8),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1
                )

            if self.notifications:
                msg, _ = self.notifications[-1]
                self.root.after(0, lambda: self.notification_label.config(text=msg))
                self.notifications.clear()

            frame_rgb = cv2.cvtColor(display_frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(frame_rgb)
            img = img.resize((640, 480))
            imgtk = ImageTk.PhotoImage(image=img)

            self.root.after(0, self._update_camera, imgtk)

        if not self.is_running:
            self.root.after(0, lambda: self.status_bar.config(text="Camera Stopped"))

    def _update_camera(self, imgtk: ImageTk.PhotoImage) -> None:
        self.camera_label.imgtk = imgtk
        self.camera_label.configure(image=imgtk)

    def stop_camera(self) -> None:
        self.is_running = False
        if self.cap:
            self.cap.release()
            self.cap = None
        self.status_bar.config(text="Camera Stopped")
        self.notification_label.config(text="Click Start Camera to begin")

    def refresh_attendance_list(self) -> None:
        for item in self.tree.get_children():
            self.tree.delete(item)
        records = self.attendance_manager.get_today_attendance()
        for r in records:
            self.tree.insert("", "end", values=(r[0], r[1], r[2] or "—"))

    def open_register(self) -> None:
        if self.is_running:
            messagebox.showinfo("Info", "Stop the camera first to register.")
            return

        win = tk.Toplevel(self.root)
        win.title("Register New User")
        win.geometry("400x250")
        win.configure(bg="#1a1a2e")

        tk.Label(win, text="Employee ID:", fg="white", bg="#1a1a2e").grid(
            row=0, column=0, padx=10, pady=5, sticky="w"
        )
        e_id = tk.Entry(win, width=30)
        e_id.grid(row=0, column=1, padx=10, pady=5)

        tk.Label(win, text="Full Name:", fg="white", bg="#1a1a2e").grid(
            row=1, column=0, padx=10, pady=5, sticky="w"
        )
        e_name = tk.Entry(win, width=30)
        e_name.grid(row=1, column=1, padx=10, pady=5)

        tk.Label(win, text="Department:", fg="white", bg="#1a1a2e").grid(
            row=2, column=0, padx=10, pady=5, sticky="w"
        )
        e_dept = tk.Entry(win, width=30)
        e_dept.grid(row=2, column=1, padx=10, pady=5)

        tk.Label(win, text="Email:", fg="white", bg="#1a1a2e").grid(
            row=3, column=0, padx=10, pady=5, sticky="w"
        )
        e_email = tk.Entry(win, width=30)
        e_email.grid(row=3, column=1, padx=10, pady=5)

        def do_register():
            emp_id = e_id.get().strip()
            name = e_name.get().strip()
            if not emp_id or not name:
                messagebox.showerror("Error", "Employee ID and Name required.")
                return

            db_path = self.config["database"].get("path", "data/attendance.db")

            def add_user(i, n, d, e):
                att = AttendanceManager(db_path=db_path)
                att.add_user(i, n, d, e)
                att.close()

            enc_file = self.config["paths"].get("encodings_file", "data/encodings.pkl")
            faces_dir = self.config["paths"].get("faces_dir", "data/faces")

            overwrite = False
            if check_user_exists(enc_file, emp_id):
                overwrite = messagebox.askyesno("Exists", "User exists. Overwrite?")

            success = register_new_user(
                employee_id=emp_id,
                name=name,
                department=e_dept.get().strip(),
                email=e_email.get().strip(),
                faces_dir=faces_dir,
                encodings_file=enc_file,
                add_user_db=add_user,
                overwrite=overwrite,
            )
            if success:
                messagebox.showinfo("Success", f"User {name} registered!")
                win.destroy()

        tk.Button(
            win, text="Register", command=do_register,
            bg="#4ecca3", fg="white", padx=20, pady=5,
        ).grid(row=4, column=1, padx=10, pady=20)

    def show_report(self) -> None:
        print_today_report(self.attendance_manager)
        messagebox.showinfo("Report", "Today's report printed to console.")

    def update_time(self) -> None:
        self.time_label.config(text=datetime.now().strftime("%Y-%m-%d  %H:%M:%S"))
        self.root.after(1000, self.update_time)

    def on_closing(self) -> None:
        self.stop_camera()
        self.attendance_manager.close()
        self.root.destroy()


def main() -> None:
    root = tk.Tk()
    app = AttendanceSystemGUI(root)
    root.protocol("WM_DELETE_WINDOW", app.on_closing)
    root.mainloop()


if __name__ == "__main__":
    main()
