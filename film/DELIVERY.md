# TExP Launch Film — Delivery & Gauntlet Ledger

## 1. Project & Truth Ledger
- **Product:** TExP — Interactive Text Animation Playground & GSAP Code Generator
- **Aesthetic:** "Obsidian Instrument" design system (dark surfaces `#121316`, Archivo + JetBrains Mono typography, single acid-lime `#bdf524` accent for live/active state, B&W logo).
- **Core Truths (Verified in Codebase):**
  - **27 built-in presets** across 5 categories (Entrance, Emphasis, 3D, Text, Creative).
  - **71 registered Google Fonts** available for real-time typographic exploration.
  - **Multi-Framework Production Export:** Generates clean, zero-dependency GSAP code for Vanilla JS, React (`@gsap/react` / `useGSAP`), and Vue in both JavaScript and TypeScript.
  - **Dual Workspaces:** Single-element rapid prototyping (**Text Animation**) and multi-track layer sequencing (**Timeline Animation**).
  - **Granular Controls:** Visual cubic-bezier curve editor with live dragging handles, ease preset selector, duration, delay, stagger, and scale sliders.

---

## 2. Technical Specifications & File Deliverables

| Asset | Location | Specifications |
|---|---|---|
| **Master Launch Film (1080p60)** | `~/Downloads/texp-launch-film-1080p60.mp4` | 1920×1080, 60.00 fps, H.264 CRF 16, AAC 256 kbps, 24.00s, −14.8 LUFS |
| **Project Master Video** | `film/renders/texp-launch-film-1080p60.mp4` | Master video copy within repository |
| **Music-Only Fallback** | `film/renders/texp-launch-film-music-only.mp4` | Full video with music bed only (no SFX), −15.0 LUFS |
| **Picture Video** | `film/renders/picture.mp4` | High-bitrate silent video render |
| **Master Audio WAV** | `film/renders/master_audio.wav` | 48 kHz 16-bit stereo PCM, −14.8 LUFS, True Peak −1.0 dBFS |
| **Soundtrack WAV** | `film/renders/soundtrack.wav` | 120 BPM D-minor synthesized electronic score |
| **SFX WAV** | `film/renders/sfx.wav` | Tactile mechanical UI clicks, whooshes, chime, ripple |
| **Contact Sheet** | `film/renders/contact-sheet.jpg` | 12-frame timeline visual progression |
| **Verified Stills (12)** | `film/renders/stills/still-*.jpg` | Frame-accurate captures across all 10 beats |
| **Deterministic Engine** | `film/index.html`, `film/src/film.js`, `film/src/film.css` | Frame-seekable GSAP timeline engine |

---

## 3. Storyboard & Visual Progression

| Beat | Timestamps | Scene Description | Business & Motion Job |
|---|---|---|---|
| **1** | 0.00 – 1.90s | Macro typography: "Static text." gets highlighted with lime caret and transforms into "Make it move." | Hook: from static text to fluid kinetic motion |
| **2** | 1.90 – 3.30s | Continuous camera pullback with 3D tilt: full TExP Obsidian workspace lands full-frame | Spatial context: the complete professional tool |
| **3** | 3.30 – 5.40s | UI close-up: cursor clicks **3D Flip** → canvas replays; clicks **Glitch** → canvas replays | Cause → effect: instant real-time preset feedback |
| **4** | 5.40 – 7.40s | 3D tilted wheel carousel spins through 27 presets with category counter; right side displays live recipes | Scale: breadth of 27 motion presets |
| **5** | 7.40 – 9.80s | Inspector close-up: cursor drags cubic-bezier handle, curve morphs, values tick, duration slider drags | Craft & precision: fine-grain curve and easing control |
| **6** | 9.80 – 12.00s | 3D registered split planes: text expands along Z-axis into Lines, Words, and Chars with stagger pulse | Deep capability: internal GSAP split-text mechanics |
| **7** | 12.00 – 14.60s | Timeline workspace: 3 sequence tracks, lime playhead sweeps across ruler, preview updates | Power workflow: multi-track timeline sequencing |
| **8** | 14.60 – 17.60s | Export Code dialog: cursor switches Vanilla/React/Vue and JS/TS; clicks Copy → "Copied ✓" | Frictionless outcome: copy-paste ready code |
| **9** | 17.60 – 19.40s | Perspective fold explodes into a 3D gallery wall of 15 preset/font cards across 71 Google fonts | Versatility: infinite kinetic design variations |
| **10** | 19.40 – 24.00s | Wall collapses to center; TEXP logo springs in; tagline, lime CTA button, URL appear. Cursor clicks button with ripple ring | Unmistakable conversion: call to action on mute |

---

## 4. Audio Design & Loudness Report
- **Soundtrack:** 120.0 BPM electronic score in D minor with 48 beats, matching exact cut points.
  - Features an energetic pulse: punchy 50 Hz sub kick, warm synth bass, rhythmic 16th-note hats, lush stereo Rhodes chords, and melodic pluck arpeggios.
  - Includes a 120 ms **dead stop** at 14.40s before the code modal pops open, and resolves into a lush Dm9 chord ring-out at 19.50s on the logo.
- **Sound Effects (SFX):**
  - **Tactile UI Clicks:** 1.8 kHz transient click + 420 Hz mechanical body thock on all cursor interactions (3.90s, 4.80s, 14.30s, 15.30s, 16.05s, 16.80s, 21.25s).
  - **Rumble-Free Whooshes:** Bandpassed pink noise (220 Hz – 2800 Hz) with Hann envelopes on major spatial camera transitions (1.90s, 5.40s, 9.80s, 12.00s, 17.55s, 19.40s).
  - **Confirmation Chime:** Dual-harmonic glass chime (1760 Hz + 2640 Hz) at 16.85s on "Copied".
  - **CTA Resonance:** Warm 220 Hz low resonance + 880 Hz harmonic at 21.30s on CTA click.
- **Loudness Compliance (`ffmpeg ebur128`):**
  - **Integrated Loudness:** `−14.8 LUFS` (Target: −14 to −19 LUFS)
  - **True Peak:** `−1.0 dBFS` (Requirement: ≤ −1.0 dBFS)
  - **Loudness Range (LRA):** `7.6 LU`

---

## 5. Gauntlet Quality Bar Verification

| Criterion | Standard | Measured Result | Verdict |
|---|---|---|---|
| **Frozen Time** | Max hold ≤ 1.0s (no static pause > 0.6s except final CTA) | No frozen intervals > 0.4s during film; final CTA holds cleanly | **PASS** |
| **Mute Comprehensibility** | Viewer understands business outcome & CTA with sound off | High-contrast bottom-left title cards + direct UI cause-and-effect | **PASS** |
| **Subject Frame Fill** | Lead subject fills 60–85% of usable frame | Workspace panels, 3D wheel, split planes, and wall cards fill 70–85% | **PASS** |
| **Deterministic Motion** | Pure function of timeline time (`window.seek(t)`) | Frame-accurate seek verified via Playwright Chrome renderer | **PASS** |
| **Audio Mix & Delivery** | Master audio within −14 to −19 LUFS, true peak ≤ −1 dBFS, music-only fallback | −14.8 LUFS, −1.0 dBFS True Peak; music-only fallback exported | **PASS** |
| **Delivery Target** | Final master MP4 copied to `~/Downloads/` | Delivered to `c:\Users\ahmra\Downloads\texp-launch-film-1080p60.mp4` | **PASS** |
