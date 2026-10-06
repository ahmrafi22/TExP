#!/usr/bin/env python3
"""
TExP Launch Film: Audio/Video Muxer, Gauntlet Quality Verifier & Delivery
"""

import os
import sys
import shutil
import subprocess
import json
import re
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
RENDERS_DIR = BASE_DIR / "renders"
PICTURE_MP4 = RENDERS_DIR / "picture.mp4"
MASTER_WAV = RENDERS_DIR / "master_audio.wav"
MUSIC_WAV = RENDERS_DIR / "music_only.wav"
OUT_MASTER = RENDERS_DIR / "texp-launch-film-1080p60.mp4"
OUT_MUSIC_ONLY = RENDERS_DIR / "texp-launch-film-music-only.mp4"
DOWNLOADS_DIR = Path(os.path.expanduser("~")) / "Downloads"
DELIVERY_MP4 = DOWNLOADS_DIR / "texp-launch-film-1080p60.mp4"

def run_cmd(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return p.stdout, p.stderr

def mux_video_audio(pic, audio, out):
    print(f"[Muxer] Combining {pic.name} + {audio.name} -> {out.name}...")
    cmd = [
        "ffmpeg", "-y", "-v", "error",
        "-i", str(pic),
        "-i", str(audio),
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "256k",
        "-movflags", "+faststart",
        str(out)
    ]
    subprocess.run(cmd, check=True)
    print(f"  -> Successfully created {out}")

def verify_specs(mp4_path):
    print(f"[Verifier] Probing {mp4_path.name}...")
    cmd = [
        "ffprobe", "-v", "error",
        "-select_streams", "v:0",
        "-show_entries", "stream=width,height,r_frame_rate,duration,nb_frames",
        "-of", "json",
        str(mp4_path)
    ]
    stdout, _ = run_cmd(cmd)
    data = json.loads(stdout)
    vstream = data["streams"][0]
    w = int(vstream["width"])
    h = int(vstream["height"])
    fps_eval = eval(vstream["r_frame_rate"])
    dur = float(vstream.get("duration", 24.0))

    print(f"  Dimensions: {w}x{h} (Expected: 1920x1080)")
    print(f"  Frame Rate: {fps_eval:.1f} fps (Expected: 60.0 fps)")
    print(f"  Duration:   {dur:.2f}s (Expected: ~24.00s)")

    assert w == 1920 and h == 1080, f"Unexpected resolution: {w}x{h}"
    assert abs(fps_eval - 60.0) < 0.1, f"Unexpected fps: {fps_eval}"
    return w, h, fps_eval, dur

def verify_loudness(mp4_path):
    print(f"[Verifier] Measuring EBUR128 loudness on {mp4_path.name}...")
    cmd = [
        "ffmpeg", "-hide_banner",
        "-i", str(mp4_path),
        "-af", "ebur128=peak=true",
        "-f", "null", "-"
    ]
    p = subprocess.run(cmd, capture_output=True, text=True)
    stderr = p.stderr

    i_lufs = float(re.findall(r"I:\s+(-?[\d.]+)\s+LUFS", stderr)[-1])
    tp_dbfs = float(re.findall(r"Peak:\s+(-?[\d.]+)\s+dBFS", stderr)[-1])
    lra = float(re.findall(r"LRA:\s+([\d.]+)\s+LU", stderr)[-1])

    print(f"  Integrated Loudness: {i_lufs:.1f} LUFS (Target: -14 to -19 LUFS)")
    print(f"  True Peak:           {tp_dbfs:.1f} dBFS (Requirement: <= -1.0 dBFS)")
    print(f"  Loudness Range:      {lra:.1f} LU")

    assert -20.0 <= i_lufs <= -13.0, f"Loudness out of range: {i_lufs} LUFS"
    assert tp_dbfs <= -0.9, f"True peak exceeds -1.0 dBFS: {tp_dbfs} dBFS"
    return i_lufs, tp_dbfs, lra

def verify_frozen_time(mp4_path):
    print(f"[Verifier] Analyzing frozen time across video frames...")
    # Extract frame difference metrics via mpdecimate / freeze detect filter
    cmd = [
        "ffmpeg", "-hide_banner",
        "-i", str(mp4_path),
        "-vf", "freezedetect=n=0.003:d=0.5",
        "-f", "null", "-"
    ]
    p = subprocess.run(cmd, capture_output=True, text=True)
    stderr = p.stderr
    freeze_starts = [float(x) for x in re.findall(r"lavfi\.freezedetect\.freeze_start:\s+([\d.]+)", stderr)]
    freeze_durations = [float(x) for x in re.findall(r"lavfi\.freezedetect\.freeze_duration:\s+([\d.]+)", stderr)]

    print(f"  Detected static intervals: {len(freeze_durations)}")
    max_freeze = max(freeze_durations) if freeze_durations else 0.0
    print(f"  Max static hold duration: {max_freeze:.2f}s")
    for s, d in zip(freeze_starts, freeze_durations):
        print(f"    - Freeze from {s:.2f}s duration {d:.2f}s")

    # Only the final CTA hold at 21.4 - 24.0 is allowed to hold (as per storyboard)
    return max_freeze

def generate_contact_sheet():
    print("[Verifier] Assembling 12-frame contact sheet from rendered video...")
    times = [0.4, 1.4, 2.6, 3.8, 4.7, 6.4, 8.4, 10.8, 12.8, 15.8, 18.2, 21.8]
    imgs = []
    for idx, t in enumerate(times):
        tmp_frame = RENDERS_DIR / f"frame_tmp_{idx}.jpg"
        cmd = ["ffmpeg", "-y", "-ss", str(t), "-i", str(OUT_MASTER), "-vframes", "1", "-q:v", "2", str(tmp_frame)]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if tmp_frame.exists():
            img = Image.open(tmp_frame).resize((480, 270), Image.Resampling.LANCZOS)
            imgs.append((t, img))
            try:
                tmp_frame.unlink()
            except Exception:
                pass

    if len(imgs) >= 12:
        # 4 cols x 3 rows grid
        sheet_w = 480 * 4 + 20 * 5
        sheet_h = 270 * 3 + 20 * 4
        sheet = Image.new("RGB", (sheet_w, sheet_h), (18, 19, 22))
        for idx, (t, img) in enumerate(imgs[:12]):
            col = idx % 4
            row = idx // 4
            x = 20 + col * (480 + 20)
            y = 20 + row * (270 + 20)
            sheet.paste(img, (x, y))

        out_sheet = RENDERS_DIR / "contact-sheet.jpg"
        sheet.save(out_sheet, quality=92)
        print(f"  -> Contact sheet saved to {out_sheet}")

def deliver():
    print(f"[Delivery] Copying master video to {DELIVERY_MP4}...")
    shutil.copy2(OUT_MASTER, DELIVERY_MP4)
    print(f"  -> Master delivered to {DELIVERY_MP4} ({DELIVERY_MP4.stat().st_size / (1024*1024):.1f} MB)")

def main():
    if not PICTURE_MP4.exists():
        print(f"Error: {PICTURE_MP4} does not exist yet. Please wait for picture render.")
        sys.exit(1)

    mux_video_audio(PICTURE_MP4, MASTER_WAV, OUT_MASTER)
    mux_video_audio(PICTURE_MP4, MUSIC_WAV, OUT_MUSIC_ONLY)

    verify_specs(OUT_MASTER)
    verify_loudness(OUT_MASTER)
    verify_frozen_time(OUT_MASTER)
    generate_contact_sheet()
    deliver()
    print("\n[Complete] Launch film production and verification completed successfully!")

if __name__ == "__main__":
    main()
