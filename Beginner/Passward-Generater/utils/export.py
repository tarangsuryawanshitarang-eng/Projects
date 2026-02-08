import json
import csv
from .helpers import calculate_entropy

def export_passwords(passwords, filename, format="txt"):
    """
    Export passwords to a file.
    """
    if format == "txt":
        with open(filename, 'w') as f:
            for pwd in passwords:
                f.write(f"{pwd}\n")

    elif format == "csv":
        with open(filename, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(["#", "Password", "Length", "Entropy"])
            for i, pwd in enumerate(passwords, 1):
                entropy = calculate_entropy(pwd)
                writer.writerow([i, pwd, len(pwd), entropy])

    elif format == "json":
        data = []
        for i, pwd in enumerate(passwords, 1):
            data.append({
                "index": i,
                "password": pwd,
                "length": len(pwd),
                "entropy": calculate_entropy(pwd)
            })
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)

    print(f"  📄 Exported {len(passwords)} passwords to: {filename}")
