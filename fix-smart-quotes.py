#!/usr/bin/env python3
import os
import glob

# Get all service MDX files
files = glob.glob('content/services/*.mdx')

for file_path in files:
    print(f'Processing: {file_path}')

    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Count original smart quotes
    original_left = content.count('"')
    original_right = content.count('"')

    # Replace smart quotes with regular quotes
    content = content.replace('"', '"')  # Left double quotation mark
    content = content.replace('"', '"')  # Right double quotation mark
    content = content.replace(''', "'")   # Left single quotation mark
    content = content.replace(''', "'")   # Right single quotation mark

    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f'  - Replaced {original_left + original_right} smart quotes')

print('Smart quotes replacement completed!')