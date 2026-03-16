#!/usr/bin/env python3
"""
Create favicon from project logo (logo2.png).
Uses ミリネ logo (Korean characters + Japanese text), NOT the character mascot.
"""
from PIL import Image
import os

# Project logo - 미리내 (미리내 한글, 파란 원형, 보라 아치, 지구 아이콘) - NOT character
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
SRC = os.path.join(PROJECT_ROOT, "public", "img", "Logo-banner", "logo-mirinae-favicon.png")
OUT = os.path.join(PROJECT_ROOT, "public", "favicon-64.png")


def process_favicon(src_path, out_path, size=64):
    img = Image.open(src_path).convert("RGBA")
    w, h = img.size
    ratio = min(size / w, size / h)
    nw, nh = int(w * ratio), int(h * ratio)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    x = (size - nw) // 2
    y = (size - nh) // 2
    canvas.paste(img, (x, y), img)
    canvas.save(out_path, "PNG", optimize=True)
    print(f"Saved {out_path} ({size}x{size})")


if __name__ == "__main__":
    if not os.path.exists(SRC):
        print(f"Source not found: {SRC}")
        exit(1)
    process_favicon(SRC, OUT, size=64)
    # Also copy to favicon.png for backward compatibility
    import shutil
    favicon_png = os.path.join(PROJECT_ROOT, "public", "favicon.png")
    shutil.copy(OUT, favicon_png)
    print(f"Copied to {favicon_png}")
