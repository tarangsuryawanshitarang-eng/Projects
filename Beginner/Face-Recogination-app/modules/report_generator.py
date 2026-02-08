"""Attendance reports and export utilities."""

import os
from datetime import datetime


def print_today_report(attendance_manager) -> None:
    """Print today's attendance report to console."""
    records = attendance_manager.get_today_attendance()
    today = datetime.now().strftime("%Y-%m-%d")
    print(f"\n{'='*60}")
    print(f"📋 Attendance Report — {today}")
    print(f"{'='*60}")
    print(f"{'ID':<10} {'Name':<20} {'In':<10} {'Out':<10} {'Status'}")
    print(f"{'-'*60}")

    for record in records:
        emp_id, name, check_in, check_out, status = record
        check_out = check_out or "---"
        print(f"{emp_id:<10} {name:<20} {check_in:<10} {check_out:<10} {status}")

    print(f"{'-'*60}")
    print(f"Total Present: {len(records)}")
    print(f"{'='*60}\n")


def export_to_csv(attendance_manager, filename: str, start_date: str | None = None, end_date: str | None = None):
    """Export attendance data to CSV."""
    import pandas as pd

    if start_date and end_date:
        records = attendance_manager.get_attendance_report(start_date, end_date)
    else:
        today = datetime.now().strftime("%Y-%m-%d")
        records = attendance_manager.get_attendance_by_date(today)

    df = pd.DataFrame(records, columns=["Employee ID", "Name", "Date", "Check-In", "Check-Out", "Status"])
    df.to_csv(filename, index=False)
    print(f"📄 Attendance exported to: {filename}")
    return df


def export_to_excel(attendance_manager, filename: str, start_date: str, end_date: str):
    """Export attendance data to Excel."""
    import pandas as pd

    records = attendance_manager.get_attendance_report(start_date, end_date)
    df = pd.DataFrame(records, columns=["Employee ID", "Name", "Date", "Check-In", "Check-Out", "Status"])

    with pd.ExcelWriter(filename, engine="openpyxl") as writer:
        df.to_excel(writer, sheet_name="Attendance", index=False)
        summary = df.groupby("Employee ID").agg({"Name": "first", "Date": "count"}).rename(
            columns={"Date": "Days Present"}
        )
        summary.to_excel(writer, sheet_name="Summary")

    print(f"📊 Attendance exported to: {filename}")
