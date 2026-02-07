#!/usr/bin/env python3
"""
PDF to AudioBook Converter - Graphical User Interface
Simple GUI for non-technical users.
"""

import os
import sys
import threading
import tkinter as tk
from tkinter import ttk, filedialog, messagebox

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


class AudioBookConverterGUI:
    """GUI for PDF to AudioBook conversion."""

    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("PDF to AudioBook Converter")
        self.root.geometry("650x850")
        self.root.configure(bg="#f0f0f0")
        self.root.minsize(550, 700)

        self.is_converting = False
        self.should_stop = False
        self.conversion_thread = None

        self.create_widgets()

    def create_widgets(self) -> None:
        """Create all GUI widgets."""
        main_frame = ttk.Frame(self.root, padding="15")
        main_frame.pack(fill="both", expand=True)

        # Title
        title_label = ttk.Label(
            main_frame,
            text="PDF to AudioBook Converter",
            font=("Segoe UI", 18, "bold"),
        )
        title_label.pack(pady=(0, 15))

        # Input file
        input_frame = ttk.LabelFrame(main_frame, text="Input PDF", padding="10")
        input_frame.pack(fill="x", pady=5)

        input_row = ttk.Frame(input_frame)
        input_row.pack(fill="x")

        self.input_path = tk.StringVar()
        ttk.Entry(input_row, textvariable=self.input_path, width=50).pack(
            side="left", fill="x", expand=True, padx=(0, 5)
        )
        ttk.Button(input_row, text="Browse...", command=self.browse_input).pack(side="right")

        # Output folder
        output_frame = ttk.LabelFrame(main_frame, text="Output Folder", padding="10")
        output_frame.pack(fill="x", pady=5)

        output_row = ttk.Frame(output_frame)
        output_row.pack(fill="x")

        self.output_path = tk.StringVar(value=os.path.join(os.getcwd(), "output"))
        ttk.Entry(output_row, textvariable=self.output_path, width=50).pack(
            side="left", fill="x", expand=True, padx=(0, 5)
        )
        ttk.Button(output_row, text="Browse...", command=self.browse_output).pack(side="right")

        # Settings
        settings_frame = ttk.LabelFrame(main_frame, text="Settings", padding="10")
        settings_frame.pack(fill="x", pady=5)

        # TTS Engine
        engine_row = ttk.Frame(settings_frame)
        engine_row.pack(fill="x", pady=3)
        ttk.Label(engine_row, text="TTS Engine:").pack(side="left", padx=(0, 10))
        self.engine_var = tk.StringVar(value="gtts")
        ttk.Radiobutton(engine_row, text="pyttsx3 (Offline)", variable=self.engine_var, value="pyttsx3").pack(
            side="left", padx=(0, 15)
        )
        ttk.Radiobutton(engine_row, text="gTTS (Online)", variable=self.engine_var, value="gtts").pack(
            side="left", padx=(0, 15)
        )
        ttk.Radiobutton(engine_row, text="edge-tts (Online)", variable=self.engine_var, value="edge-tts").pack(
            side="left"
        )

        # Voice
        voice_row = ttk.Frame(settings_frame)
        voice_row.pack(fill="x", pady=3)
        ttk.Label(voice_row, text="Voice:").pack(side="left", padx=(0, 10))
        self.voice_var = tk.StringVar(value="female")
        ttk.Radiobutton(voice_row, text="Female", variable=self.voice_var, value="female").pack(
            side="left", padx=(0, 15)
        )
        ttk.Radiobutton(voice_row, text="Male", variable=self.voice_var, value="male").pack(side="left")

        # Language
        lang_row = ttk.Frame(settings_frame)
        lang_row.pack(fill="x", pady=3)
        ttk.Label(lang_row, text="Language:").pack(side="left", padx=(0, 10))
        self.lang_var = tk.StringVar(value="en")
        lang_combo = ttk.Combobox(
            lang_row,
            textvariable=self.lang_var,
            values=["en", "es", "fr", "de", "hi", "ja", "pt", "ru", "zh-CN"],
            width=12,
        )
        lang_combo.pack(side="left")

        # Speed
        speed_row = ttk.Frame(settings_frame)
        speed_row.pack(fill="x", pady=3)
        ttk.Label(speed_row, text="Speed (WPM):").pack(side="left", padx=(0, 10))
        self.rate_var = tk.IntVar(value=170)
        rate_scale = ttk.Scale(
            speed_row,
            from_=100,
            to=250,
            variable=self.rate_var,
            orient="horizontal",
            length=200,
            command=lambda v: self.rate_label.config(text=f"{int(float(v))} WPM"),
        )
        rate_scale.pack(side="left", padx=5)
        self.rate_label = ttk.Label(speed_row, text="170 WPM")
        self.rate_label.pack(side="left")

        # Format & Options
        opt_row = ttk.Frame(settings_frame)
        opt_row.pack(fill="x", pady=3)
        ttk.Label(opt_row, text="Format:").pack(side="left", padx=(0, 10))
        self.format_var = tk.StringVar(value="mp3")
        for fmt in ["mp3", "wav"]:
            ttk.Radiobutton(opt_row, text=fmt.upper(), variable=self.format_var, value=fmt).pack(
                side="left", padx=(0, 10)
            )
        self.split_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(
            opt_row,
            text="Split by chapters",
            variable=self.split_var,
            onvalue=True,
            offvalue=False,
        ).pack(side="left", padx=(20, 0))
        self.ocr_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(opt_row, text="Use OCR", variable=self.ocr_var, onvalue=True, offvalue=False).pack(
            side="left", padx=(10, 0)
        )

        # Preview
        preview_frame = ttk.LabelFrame(main_frame, text="Preview", padding="10")
        preview_frame.pack(fill="both", expand=True, pady=5)

        self.preview_text = tk.Text(preview_frame, height=8, wrap="word", font=("Consolas", 9))
        self.preview_text.pack(fill="both", expand=True)
        ttk.Button(preview_frame, text="Extract & Preview Text", command=self.preview_extract).pack(
            pady=(5, 0)
        )

        # Progress
        progress_frame = ttk.LabelFrame(main_frame, text="Progress", padding="10")
        progress_frame.pack(fill="x", pady=5)

        self.progress_var = tk.DoubleVar(value=0)
        self.progress_bar = ttk.Progressbar(
            progress_frame, length=400, mode="determinate", variable=self.progress_var
        )
        self.progress_bar.pack(fill="x", pady=5)

        self.status_var = tk.StringVar(value="Ready")
        self.status_label = ttk.Label(progress_frame, textvariable=self.status_var)
        self.status_label.pack(anchor="w")

        # Buttons
        btn_frame = ttk.Frame(main_frame)
        btn_frame.pack(fill="x", pady=15)

        self.convert_btn = ttk.Button(
            btn_frame,
            text="Convert to AudioBook",
            command=self.start_conversion,
        )
        self.convert_btn.pack(side="left", padx=(0, 10))

        ttk.Button(btn_frame, text="Clear", command=self.clear_all).pack(side="left")

    def browse_input(self) -> None:
        """Browse for input PDF file."""
        filepath = filedialog.askopenfilename(
            filetypes=[("PDF files", "*.pdf"), ("All files", "*.*")]
        )
        if filepath:
            self.input_path.set(filepath)

    def browse_output(self) -> None:
        """Browse for output folder."""
        dirpath = filedialog.askdirectory()
        if dirpath:
            self.output_path.set(dirpath)

    def preview_extract(self) -> None:
        """Extract and preview text from PDF."""
        pdf_path = self.input_path.get()
        if not pdf_path:
            messagebox.showerror("Error", "Please select a PDF file.")
            return
        if not os.path.exists(pdf_path):
            messagebox.showerror("Error", f"File not found: {pdf_path}")
            return

        self.status_var.set("Extracting text...")
        self.root.update()

        def do_extract():
            try:
                from modules.pdf_extractor import smart_extract
                from modules.text_cleaner import clean_text

                text = smart_extract(pdf_path, force_ocr=self.ocr_var.get(), verbose=False)
                if text:
                    text = clean_text(text)
                    self.root.after(0, lambda: self._show_preview(text))
                else:
                    self.root.after(0, lambda: messagebox.showerror("Error", "No text could be extracted."))
            except Exception as e:
                self.root.after(0, lambda: messagebox.showerror("Error", str(e)))
            self.root.after(0, lambda: self.status_var.set("Ready"))

        threading.Thread(target=do_extract, daemon=True).start()

    def _show_preview(self, text: str) -> None:
        """Display preview text."""
        self.preview_text.delete("1.0", tk.END)
        self.preview_text.insert("1.0", text[:3000] + ("..." if len(text) > 3000 else ""))
        self.status_var.set(f"Preview: {len(text)} characters, ~{len(text.split())} words")

    def start_conversion(self) -> None:
        """Start the conversion process."""
        if not self.input_path.get():
            messagebox.showerror("Error", "Please select a PDF file.")
            return

        self.is_converting = True
        self.should_stop = False
        self.convert_btn.config(state="disabled")
        self.status_var.set("Converting...")
        self.progress_var.set(0)

        self.conversion_thread = threading.Thread(target=self.run_conversion, daemon=True)
        self.conversion_thread.start()

    def run_conversion(self) -> None:
        """Run conversion in background thread."""
        try:
            pdf_path = self.input_path.get()
            output_dir = self.output_path.get()
            engine = self.engine_var.get()
            voice = self.voice_var.get()
            lang = self.lang_var.get()
            rate = self.rate_var.get()
            fmt = self.format_var.get()
            split_chapters = self.split_var.get()
            use_ocr = self.ocr_var.get()

            from modules.pdf_extractor import smart_extract
            from modules.text_cleaner import clean_text
            from modules.chapter_detector import detect_chapters
            from modules.tts_converter import (
                text_to_speech_offline,
                text_to_speech_online,
                text_to_speech_edge,
            )
            from modules.utils import sanitize_filename

            def update_status(msg: str) -> None:
                self.root.after(0, lambda: self.status_var.set(msg))

            def update_progress(pct: float) -> None:
                self.root.after(0, lambda: self.progress_var.set(pct))

            # Extract text
            update_status("Extracting text...")
            text = smart_extract(pdf_path, force_ocr=use_ocr, verbose=False)
            if not text or len(text.strip()) < 10:
                self.root.after(
                    0,
                    lambda: messagebox.showerror(
                        "Error",
                        "No text could be extracted. Try enabling OCR for scanned PDFs.",
                    ),
                )
                return
            text = clean_text(text)

            # Detect chapters
            if split_chapters:
                chapters = detect_chapters(text)
            else:
                chapters = [{"title": "Full Book", "content": text, "index": 1}]

            book_name = os.path.splitext(os.path.basename(pdf_path))[0]
            out_dir = os.path.join(output_dir, sanitize_filename(book_name, 100))
            os.makedirs(out_dir, exist_ok=True)

            total = len(chapters)
            audio_files = []

            for i, chapter in enumerate(chapters):
                if self.should_stop:
                    update_status("Conversion stopped.")
                    break

                update_status(f"Converting chapter {i + 1}/{total}: {chapter['title'][:40]}...")
                update_progress(100 * (i / total))

                safe_title = sanitize_filename(chapter["title"], 50)
                output_path = os.path.join(
                    out_dir,
                    f"Chapter_{chapter['index']:02d}_{safe_title}.{fmt}"
                    if split_chapters
                    else f"{book_name}.{fmt}",
                )
                if not split_chapters:
                    output_path = os.path.join(out_dir, f"{book_name}.{fmt}")

                success = False
                if engine == "pyttsx3":
                    success = text_to_speech_offline(
                        chapter["content"], output_path,
                        voice_gender=voice, rate=rate, volume=0.9
                    )
                elif engine == "gtts":
                    success = text_to_speech_online(chapter["content"], output_path, language=lang)
                elif engine == "edge-tts":
                    voice_name = "en-US-AriaNeural" if voice == "female" else "en-US-GuyNeural"
                    success = text_to_speech_edge(chapter["content"], output_path, voice=voice_name)

                if success:
                    audio_files.append(output_path)

            update_progress(100)
            update_status(f"Complete! {len(audio_files)} file(s) saved to {out_dir}")

            self.root.after(
                0,
                lambda: messagebox.showinfo(
                    "Success",
                    f"AudioBook created!\n\nSaved to:\n{out_dir}\n\n{len(audio_files)} audio file(s) generated.",
                ),
            )

        except Exception as e:
            self.root.after(0, lambda: messagebox.showerror("Error", str(e)))
        finally:
            self.root.after(0, self.conversion_complete)

    def conversion_complete(self) -> None:
        """Handle conversion completion."""
        self.is_converting = False
        self.convert_btn.config(state="normal")
        self.progress_var.set(100)

    def clear_all(self) -> None:
        """Clear all fields."""
        self.input_path.set("")
        self.preview_text.delete("1.0", tk.END)
        self.status_var.set("Ready")
        self.progress_var.set(0)


def main() -> None:
    """Launch the GUI."""
    root = tk.Tk()
    app = AudioBookConverterGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
