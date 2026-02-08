import tkinter as tk
from tkinter import ttk, messagebox
import secrets
from generators import (
    generate_password, generate_passphrase, 
    generate_pronounceable, generate_pin
)
from analyzer import PasswordStrengthAnalyzer, check_password_breach
from utils import PasswordHistory, copy_to_clipboard

class PasswordGeneratorGUI:
    """Graphical Password Generator using Tkinter."""

    COLORS = {
        "bg": "#1a1a2e",
        "surface": "#16213e",
        "input_bg": "#0f3460",
        "primary": "#6c63ff",
        "primary_hover": "#5a52d5",
        "success": "#00e676",
        "warning": "#ffd600",
        "danger": "#ff5252",
        "text": "#e0e0e0",
        "text_dim": "#8888aa",
        "password_bg": "#0a1628",
    }

    def __init__(self):
        self.root = tk.Tk()
        self.root.title("🔐 Password Generator")
        self.root.configure(bg=self.COLORS["bg"])
        self.root.geometry("520x700")
        self.root.resizable(False, False)

        self.analyzer = PasswordStrengthAnalyzer()
        self.current_password = ""

        self.create_widgets()
        self.generate()
        self.center_window()

    def create_widgets(self):
        main_frame = tk.Frame(self.root, bg=self.COLORS["bg"])
        main_frame.pack(fill="both", expand=True, padx=20, pady=15)

        tk.Label(
            main_frame, text="🔐 Password Generator",
            font=("Helvetica", 20, "bold"),
            fg=self.COLORS["primary"], bg=self.COLORS["bg"]
        ).pack(pady=(0, 15))

        # Mode
        mode_frame = tk.Frame(main_frame, bg=self.COLORS["bg"])
        mode_frame.pack(fill="x", pady=(0, 10))
        tk.Label(mode_frame, text="Mode:", font=("Helvetica", 10),
                 fg=self.COLORS["text"], bg=self.COLORS["bg"]).pack(side="left")

        self.mode_var = tk.StringVar(value="Random")
        mode_combo = ttk.Combobox(
            mode_frame, textvariable=self.mode_var,
            values=["Random", "Passphrase", "Pronounceable", "PIN"],
            state="readonly", width=15
        )
        mode_combo.pack(side="left", padx=10)
        mode_combo.bind("<<ComboboxSelected>>", lambda e: self.generate())

        # Length
        length_frame = tk.Frame(main_frame, bg=self.COLORS["bg"])
        length_frame.pack(fill="x", pady=5)
        tk.Label(length_frame, text="Length:", font=("Helvetica", 10),
                 fg=self.COLORS["text"], bg=self.COLORS["bg"]).pack(side="left")

        self.length_var = tk.IntVar(value=16)
        self.length_slider = tk.Scale(
            length_frame, from_=4, to=64,
            orient="horizontal", variable=self.length_var,
            bg=self.COLORS["bg"], fg=self.COLORS["text"],
            highlightthickness=0, troughcolor=self.COLORS["input_bg"],
            activebackground=self.COLORS["primary"],
            command=lambda v: self.generate()
        )
        self.length_slider.pack(side="left", fill="x", expand=True, padx=10)

        self.length_label = tk.Label(
            length_frame, text="16", font=("Helvetica", 12, "bold"),
            fg=self.COLORS["primary"], bg=self.COLORS["bg"], width=3
        )
        self.length_label.pack(side="right")

        # Options
        options_frame = tk.LabelFrame(
            main_frame, text="Character Types",
            font=("Helvetica", 10),
            fg=self.COLORS["text_dim"], bg=self.COLORS["bg"],
            labelanchor="n"
        )
        options_frame.pack(fill="x", pady=10)

        self.var_upper = tk.BooleanVar(value=True)
        self.var_lower = tk.BooleanVar(value=True)
        self.var_digits = tk.BooleanVar(value=True)
        self.var_symbols = tk.BooleanVar(value=True)

        checkboxes = [
            ("Uppercase (A-Z)", self.var_upper),
            ("Lowercase (a-z)", self.var_lower),
            ("Digits (0-9)", self.var_digits),
            ("Symbols (!@#$)", self.var_symbols),
        ]

        for i, (text, var) in enumerate(checkboxes):
            row = i // 2
            col = i % 2
            cb = tk.Checkbutton(
                options_frame, text=text, variable=var,
                bg=self.COLORS["bg"], fg=self.COLORS["text"],
                selectcolor=self.COLORS["input_bg"],
                activebackground=self.COLORS["bg"],
                activeforeground=self.COLORS["text"],
                font=("Helvetica", 9),
                command=self.generate
            )
            cb.grid(row=row, column=col, sticky="w", padx=15, pady=3)

        # Display
        pwd_frame = tk.Frame(main_frame, bg=self.COLORS["bg"])
        pwd_frame.pack(fill="x", pady=15)

        self.password_var = tk.StringVar()
        self.password_entry = tk.Entry(
            pwd_frame, textvariable=self.password_var,
            font=("Courier New", 14, "bold"),
            fg=self.COLORS["success"], bg=self.COLORS["password_bg"],
            relief="flat", justify="center", state="readonly"
        )
        self.password_entry.pack(side="left", fill="x", expand=True, ipady=10)

        copy_btn = tk.Button(
            pwd_frame, text="📋\nCopy", font=("Helvetica", 9),
            bg=self.COLORS["primary"], fg="white", relief="flat",
            command=self.copy_password
        )
        copy_btn.pack(side="right", fill="y", padx=(10, 0))

        # Strength Meter
        self.strength_canvas = tk.Canvas(
            main_frame, height=20, bg=self.COLORS["surface"], highlightthickness=0
        )
        self.strength_canvas.pack(fill="x", pady=5)

        self.strength_label = tk.Label(
            main_frame, text="", font=("Helvetica", 10),
            fg=self.COLORS["text"], bg=self.COLORS["bg"]
        )
        self.strength_label.pack()

        # Action Buttons
        btn_frame = tk.Frame(main_frame, bg=self.COLORS["bg"])
        btn_frame.pack(fill="x", pady=15)

        tk.Button(btn_frame, text="🔄 Generate", bg=self.COLORS["primary"], fg="white",
                  command=self.generate).pack(side="left", expand=True, padx=5, fill="x")
        tk.Button(btn_frame, text="💾 Save", bg="#2196F3", fg="white",
                  command=self.save_password).pack(side="left", expand=True, padx=5, fill="x")
        tk.Button(btn_frame, text="🔍 Check Breach", bg="#FF9800", fg="white",
                  command=self.check_breach).pack(side="left", expand=True, padx=5, fill="x")

    def generate(self, *args):
        mode = self.mode_var.get()
        length = self.length_var.get()
        self.length_label.config(text=str(length))

        try:
            if mode == "Random":
                pwd = generate_password(
                    length=length,
                    use_uppercase=self.var_upper.get(),
                    use_lowercase=self.var_lower.get(),
                    use_digits=self.var_digits.get(),
                    use_symbols=self.var_symbols.get(),
                )
            elif mode == "Passphrase":
                pwd = generate_passphrase(num_words=max(3, length // 5))
            elif mode == "Pronounceable":
                pwd = generate_pronounceable(length=length)
            elif mode == "PIN":
                pwd = generate_pin(length=min(length, 12))
            else:
                pwd = generate_password(length=length)
        except Exception as e:
            self.password_var.set(f"Error: {e}")
            return

        self.current_password = pwd
        self.password_var.set(pwd)
        self.update_strength(pwd)

    def update_strength(self, password):
        result = self.analyzer.analyze(password)
        score = result['score']
        self.strength_canvas.delete("all")
        width = self.strength_canvas.winfo_width() or 460
        
        if score >= 80: color = self.COLORS["success"]
        elif score >= 60: color = "#4CAF50"
        elif score >= 40: color = self.COLORS["warning"]
        else: color = self.COLORS["danger"]

        fill_width = int(width * score / 100)
        self.strength_canvas.create_rectangle(0, 0, fill_width, 20, fill=color, outline="")
        self.strength_label.config(text=f"{result['rating_emoji']} {result['rating']} ({score}%)", fg=color)

    def copy_password(self):
        if self.current_password:
            self.root.clipboard_clear()
            self.root.clipboard_append(self.current_password)
            messagebox.showinfo("Copied", "Password copied to clipboard!")

    def save_password(self):
        if self.current_password:
            history = PasswordHistory()
            result = self.analyzer.analyze(self.current_password)
            history.add(self.current_password, label="GUI Generated", mode=self.mode_var.get(), strength_score=result['score'])
            messagebox.showinfo("Saved", "Password saved to history!")

    def check_breach(self):
        if self.current_password:
            result = check_password_breach(self.current_password)
            messagebox.showinfo("Breach Info", result['message'])

    def center_window(self):
        self.root.update_idletasks()
        x = (self.root.winfo_screenwidth() // 2) - (260)
        y = (self.root.winfo_screenheight() // 2) - (350)
        self.root.geometry(f"+{x}+{y}")

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = PasswordGeneratorGUI()
    app.run()
