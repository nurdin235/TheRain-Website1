#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Compress all images in /public/images and create WebP versions."""
import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() not in ('utf-8', 'utf-8-sig'):
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from PIL import Image
import os

IMG_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'images')
MAX_WIDTH = 1200
QUALITY = 78

# Keep these as-is (small UI assets / logos)
SKIP = {'favicon.png', 'logo_dark.png', 'logo_light.png', 'appstore_badge.png'}

def human(n): return f"{n/1024:.0f}KB"

def process(filename):
    if filename in SKIP:
        return
    ext = os.path.splitext(filename)[1].lower()
    if ext not in {'.jpg', '.jpeg', '.png'}:
        return

    path = os.path.join(IMG_DIR, filename)
    orig_size = os.path.getsize(path)

    img = Image.open(path)
    w, h = img.size

    # Resize if wider than MAX_WIDTH
    if w > MAX_WIDTH:
        ratio = MAX_WIDTH / w
        img = img.resize((MAX_WIDTH, int(h * ratio)), Image.LANCZOS)
        w, h = img.size

    base = os.path.splitext(filename)[0]
    webp_path = os.path.join(IMG_DIR, base + '.webp')

    # Create WebP version
    img_for_webp = img.convert('RGBA') if img.mode in ('P', 'LA') else img
    if img_for_webp.mode not in ('RGB', 'RGBA'):
        img_for_webp = img_for_webp.convert('RGB')
    img_for_webp.save(webp_path, 'WEBP', quality=QUALITY, method=4)
    webp_size = os.path.getsize(webp_path)

    # Compress original in-place
    if ext in {'.jpg', '.jpeg'}:
        save_img = img if img.mode == 'RGB' else img.convert('RGB')
        save_img.save(path, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
    else:  # PNG
        # If no alpha → convert to JPEG (huge savings!)
        has_alpha = img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info)
        if not has_alpha:
            jpg_path = os.path.join(IMG_DIR, base + '.jpg')
            save_img = img.convert('RGB')
            save_img.save(jpg_path, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
            jpg_size = os.path.getsize(jpg_path)
            print(f"  {filename:<28} {human(orig_size):>7} → JPEG {human(jpg_size):>6} | WebP {human(webp_size):>6}  [PNG→JPG, kept PNG too]")
            # Compress original PNG too for fallback
            save_img.save(path, 'PNG', optimize=True)
        else:
            img.save(path, 'PNG', optimize=True)
        new_size = os.path.getsize(path)
        if has_alpha:
            saved = round((1 - new_size / orig_size) * 100)
            print(f"  {filename:<28} {human(orig_size):>7} → {human(new_size):>6} ({saved}% saved) | WebP {human(webp_size):>6}")
        return

    new_size = os.path.getsize(path)
    saved = round((1 - new_size / orig_size) * 100)
    print(f"  {filename:<28} {human(orig_size):>7} → {human(new_size):>6} ({saved}% saved) | WebP {human(webp_size):>6}")

print(f"Processing images in {os.path.abspath(IMG_DIR)}\n")
for f in sorted(os.listdir(IMG_DIR)):
    try:
        process(f)
    except Exception as e:
        print(f"  ERROR {f}: {e}", file=sys.stderr)

print("\nDone.")
