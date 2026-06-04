#!/usr/bin/env python3
"""
Post-build script for Next.js static export.
Fixes the double-layout issue where /en/ pages contain both the root (Chinese)
layout and the en (English) layout nested inside.

This script:
1. For each /en/*.html file, extracts only the inner <html>...</html> block
   (the English layout content)
2. Replaces the file with the cleaned version
3. Also fixes the index.html at the root level
"""

import os
import re
import glob

OUTPUT_DIR = "out"

def fix_en_page(filepath):
    """Fix an English page by removing the outer (Chinese) layout wrapper."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if this file has nested HTML (double layout issue)
    html_starts = [m.start() for m in re.finditer(r'<html', content)]
    
    if len(html_starts) <= 1:
        # No double layout, skip
        return False

    # Find the second <html> tag (the inner English layout)
    second_html_start = html_starts[1]
    
    # Find the corresponding </html> - it should be the last </html> in the file
    last_html_end = content.rfind('</html>')
    
    # Extract the inner content (from second <html> to last </html>)
    inner_content = content[second_html_start:last_html_end + len('</html>')]
    
    # Write the fixed content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(inner_content)
    
    return True

def main():
    fixed_count = 0
    
    # Fix all /en/ HTML files
    en_files = glob.glob(os.path.join(OUTPUT_DIR, 'en', '**', '*.html'), recursive=True)
    
    for filepath in en_files:
        if fix_en_page(filepath):
            fixed_count += 1
            print(f"  Fixed: {filepath}")
    
    # Also fix the root index.html if it's the Chinese version
    # (it should be Chinese, so we don't touch it)
    
    print(f"\nTotal files fixed: {fixed_count}")

if __name__ == '__main__':
    main()
