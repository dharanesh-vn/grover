import os
import re

try:
    import emoji
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "emoji"])
    import emoji

# Directories to process
DIRS = [
    r"d:\grover\frontend\src",
    r"d:\grover\backend"
]

# Color replacements mapping
REPLACEMENTS = {
    # CSS variables in styles.css
    "--primary: #3b82f6": "--primary: #2F6B3F",
    "--primary-hover: #2563eb": "--primary-hover: #1c4026",
    "--accent: #8b5cf6": "--accent: #458B55",
    
    # Hex codes in source files
    "#3b82f6": "#2F6B3F",
    "#2563eb": "#1c4026",
    "#8b5cf6": "#458B55",

    # RGBA replacements
    "59, 130, 246": "47, 107, 63", # Primary rgba
    "139, 92, 246": "69, 139, 85"  # Accent rgba
}

def clean_file(path):
    # Only process specific files
    if not path.endswith(('.ts', '.html', '.css', '.md', '.json', '.js')):
        return
        
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        
        # 1. Remove emojis
        content = emoji.replace_emoji(content, replace='')

        # 2. Replace colors
        for old, new in REPLACEMENTS.items():
            content = content.replace(old, new)

        # Write back if changed
        if content != original_content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {path}")

    except Exception as e:
        print(f"Failed to process {path}: {e}")

def main():
    for d in DIRS:
        for root, dirs, files in os.walk(d):
            if 'node_modules' in root or '.git' in root or '.angular' in root:
                continue
            for file in files:
                clean_file(os.path.join(root, file))
                
    # Also clean README.md at root
    clean_file(r"d:\grover\README.md")

if __name__ == "__main__":
    main()
