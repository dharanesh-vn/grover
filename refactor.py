import os
import re

directory = r"d:\grover"

# Map for content replacement
replacements = {
    r'\bManager\b': 'Admin',
    r'\bFarmer\b': 'Agronomist',
    r'\bWorker\b': 'Operator',
    r'\bmanager\b': 'admin',
    r'\bfarmer\b': 'agronomist',
    r'\bworker\b': 'operator',
    r'\bManagers\b': 'Admins',
    r'\bFarmers\b': 'Agronomists',
    r'\bWorkers\b': 'Operators',
    r'\bmanagers\b': 'admins',
    r'\bfarmers\b': 'agronomists',
    r'\bworkers\b': 'operators',
}

exempt_dirs = ['.git', 'node_modules', '.angular']

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        return # Skip binary files
    except Exception:
        return

    new_content = content
    for pattern, replacement in replacements.items():
        new_content = re.sub(pattern, replacement, new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

def rename_path_components(path):
    root, ext = os.path.splitext(path)
    # Simple replacement for filenames
    new_name = os.path.basename(path)
    new_name = new_name.replace('manager', 'admin')
    new_name = new_name.replace('Manager', 'Admin')
    new_name = new_name.replace('farmer', 'agronomist')
    new_name = new_name.replace('Farmer', 'Agronomist')
    new_name = new_name.replace('worker', 'operator')
    new_name = new_name.replace('Worker', 'Operator')
    return os.path.join(os.path.dirname(path), new_name)

# 1. Replace content in all files
for root, dirs, files in os.walk(directory):
    dirs[:] = [d for d in dirs if d not in exempt_dirs]
    for file in files:
        if file.endswith(('.js', '.ts', '.html', '.css', '.md', '.json')):
            filepath = os.path.join(root, file)
            replace_in_file(filepath)

# 2. Rename files (bottom-up to avoid breaking paths during traversal)
for root, dirs, files in os.walk(directory, topdown=False):
    dirs[:] = [d for d in dirs if d not in exempt_dirs]
    for file in files:
        filepath = os.path.join(root, file)
        new_filepath = rename_path_components(filepath)
        if filepath != new_filepath:
            os.rename(filepath, new_filepath)
            
    # Rename directories
    for d in dirs:
        dirpath = os.path.join(root, d)
        new_dirpath = rename_path_components(dirpath)
        if dirpath != new_dirpath:
            os.rename(dirpath, new_dirpath)

print("Refactoring complete.")
