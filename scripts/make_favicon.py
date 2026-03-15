#!/usr/bin/env python3
"""
Create favicon with transparent background:
- Only content inside the dark circular border is visible
- White background (inside and outside circle) -> transparent
- Area outside circle -> transparent
"""
from PIL import Image
import math
import os

SRC = "/Users/dangunee/Library/Application Support/Cursor/User/workspaceStorage/1773499252677/images/7U--r9db_400x400-bf088c64-4f53-4da5-b8cf-88c69ac6fc4f.png"
OUT = "/Users/dangunee/mirinae/public/favicon.png"

# Favicon sizes
SIZES = [32, 64, 128, 256]

def is_white_or_near_white(pixel, threshold=240):
    """Consider pixel transparent if it's white or very light."""
    if len(pixel) == 4:
        r, g, b, a = pixel
    else:
        r, g, b = pixel
    return r >= threshold and g >= threshold and b >= threshold

def process_favicon(src_path, out_path, size=32):
    img = Image.open(src_path).convert("RGBA")
    w, h = img.size
    cx, cy = w / 2, h / 2
    # Circle radius: slightly inside the border to avoid cutting it
    radius = min(w, h) / 2 - 2

    pixels = img.load()
    for y in range(h):
        for x in range(w):
            dist = math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
            # Outside circle -> transparent
            if dist > radius:
                pixels[x, y] = (0, 0, 0, 0)
            # Inside circle: white/near-white -> transparent
            elif is_white_or_near_white(pixels[x, y], threshold=250):
                pixels[x, y] = (0, 0, 0, 0)

    # Resize for favicon
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    img.save(out_path, "PNG", optimize=True)
    print(f"Saved {out_path} ({size}x{size})")

if __name__ == "__main__":
    if not os.path.exists(SRC):
        print(f"Source not found: {SRC}")
        exit(1)
    # 64x64 for crisp display on retina
    process_favicon(SRC, OUT, size=64)
