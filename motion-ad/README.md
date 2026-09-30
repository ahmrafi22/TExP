# TExP — 15-second motion ad (16:9, 1920×1080)

A sound-off 15s landscape motion ad for **TExP** (the GSAP text-animation playground in this
repo), built as one HTML page driven by a paused GSAP timeline. Every product image
in it is a **real screenshot of the running app** — no mockups, no stock, no
fabricated reviews or ratings. **No version numbers appear anywhere in the ad.**

## Files

| File | What it is |
| --- | --- |
| `index.html` | The ad. Open it in a browser — it autoplays and loops. |
| `texp-motion-ad-standalone.html` | Single-file build (GSAP + images inlined) for sharing. |
| `ad-1920x1080.mp4` | The rendered video (H.264 High, 1920×1080, 30fps, 450 frames). |
| `gsap.min.js` | GSAP 3 runtime the ad loads (same library the app itself uses). |
| `a/` | Product imagery captured from the live app (see below). |
| `scripts/` | Reproducible capture / packing / render helpers. |

## Look

The ad chrome uses **TExP's own dark-theme tokens**, lifted verbatim from
`app/globals.css` (the `.dark` block) and kept as OKLCH values:

- obsidian surfaces `--background oklch(0.148 0.006 260)`, `--card`, `--popover`
- off-white ink `oklch(0.95 0.004 140)`, muted `oklch(0.70 0.010 260)`
- **one** acid-lime accent `--primary oklch(0.87 0.20 128)` on ink `oklch(0.18 0.03 145)`

Per the design system the accent means *live / selected / focused* only: the lime
CTA button, the lime dot on the running-CTA chip, the lime category dots in the
preset wall, and a lime bloom that rises **only while the type is animating**.
There is no second accent and no coloured wash on the chrome.

The blue → near-black → crimson ramp is **not** ad chrome. It lives solely inside
the app's own artboard, injected at capture time, so the product screenshots sit
inside the ad's palette while the ad itself stays on-brand.

## Beats (15s total)

| Time | Beat | What's on screen |
| --- | --- | --- |
| 0–2.9s | Hook | Copy left — "Animate text — *without code.*" — with the real app window framed right; a tap hits Play. Proof pills: **27 presets · 71 fonts · 3 export langs**. |
| 2.9–6.2s | Library | Tilted wall of all 27 real preset names, "Aa" samples of real app fonts, chip naming all five preset categories. |
| 6.2–10.6s | **Text showcase** | Three **live** text animations rendered as real per-character DOM and animated by GSAP: **Elastic Pop**, **Blur Scale**, **Wave (per char)**. This is the centrepiece — the type itself moves, it isn't a screenshot. |
| 10.6–13.0s | Output | "Then ship it." — three product surfaces side by side: Split text → Timeline mode → Export. |
| 13.0–15s | CTA | End card: logo, "Make words *move.*", **Get TExP** → `github.com/ahmrafi22/TExP`, ringed by **all 27 preset names** on two elliptical pill orbits. |

### The end-card preset ring

The ring carries **every** real preset name from `lib/presets.ts` — the previous
version showed only 4 chips in the corners. Presets **repeat** so both orbits
read as a continuous pill structure rather than sparse lozenges.

Pills are placed by angle on two ellipses (`rx 806×486` outer, `640×372` inner,
centred on the 1920×1080 stage) and any slot that would land on the logo,
headline, CTA or URL is **skipped, not moved** — that is what produces the
natural arc gaps top-centre and bottom-centre that frame the message while
keeping the type legible. Placement is verified in-page: 44 pills kept of 56
slots, 0 collisions, all fully in frame, 90px minimum gap.

Every claim is verifiable in the repo: 27 presets (`lib/presets.ts`), 71 fonts
(`lib/fonts.ts`), char/word/line splitting (`types/animation.ts`), React-Vue-Vanilla ×
JS/TS export (`utils/code-generator.ts`), Next.js + GSAP (`package.json`).

## The text showcase is genuinely animated

The centrepiece builds real `<span class="ch">` per-character nodes and drives them
with the same GSAP techniques the app itself exports — `elastic.out`, a
`blur()`+scale tween, and a staggered per-char `y` wave. Nothing in that beat is a
screenshot, so the ad demonstrates the product instead of describing it.

## Images are never stretched

Every screenshot is displayed in a box that matches its natural aspect ratio
(`aspect-ratio` + `object-fit: cover`), so the UI is cropped at worst, never
distorted. `scripts/check-page.cjs` verifies this and reports any image whose
rendered box aspect differs from its intrinsic one; run it after any asset swap:

```bash
node scripts/check-page.cjs index.html
```

## The images in `a/` are real captures

`a/canvas-before.jpg`, `a/canvas-after.jpg` (Zoom Rotate mid-flight), `a/split-canvas.jpg`
(Bounce In mid-flight), `a/hero-app.jpg` (full workspace), `a/timeline.jpg`,
`a/code-dialog.jpg` were all taken from the app running locally in dark mode, with
the version badge stripped and the artboard graded to the blue→crimson ramp — that
ramp is intentionally confined to the captured artboards, never to the ad chrome.

To re-capture them (the repo's dev server is started and stopped automatically):

```bash
cd scripts
npm install                  # playwright-core, once
node run-with-server.cjs capture.cjs
```

The orchestrator boots `npm run dev` on port **3117** (a dedicated port so an
unrelated dev server on :3000 can't shadow it), runs the capture, then stops it.
`scripts/diagnose*.cjs` and `scripts/sample-colors.py` document how the UI selectors
and the brand hexes were derived.

## Render to MP4

Uses the bundled motion-ad skill renderer (frame-accurate seek → ffmpeg):

```bash
# from this folder
node ../../.agents/skills/motion-ad/scripts/render.cjs --size 1920x1080 --stills 2.2,7.0,14.95   # QA frames
node ../../.agents/skills/motion-ad/scripts/render.cjs --size 1920x1080 --out ad-1920x1080.mp4    # full video
```

The one-shot render takes several minutes, so for a foreground shell use
`scripts/render-seg.cjs`, which writes numbered PNGs for a frame range and then
encodes in a single ffmpeg pass with the same settings:

```bash
node scripts/render-seg.cjs --from 0 --to 45      # repeat in ~45-frame chunks to 450
ffmpeg -y -framerate 30 -i frames/%04d.png -c:v libx264 -preset slow -crf 15 \
       -pix_fmt yuv420p -movflags +faststart ad-1920x1080.mp4
```

## Notes / caveats

- The CTA points at the **GitHub repo** — there is no hosted landing page for TExP,
  so no URL or "free/sign-up" claim appears in the ad. Swap `CONFIG.cta.foot` and the
  `#btn` href if a site goes live.
- Product screenshots are captured from the app running locally at **1920×1200 @2x**
  (3840×2400), which is a 16:10 match for the framed window, so no scaling distortion
  is introduced. The version badge is stripped from every capture.
- The end-card touch ring is **ink**, not lime — a lime ring is invisible against the
  lime CTA button.
- The tech chip ("Built on Next.js + GSAP") was **removed** from the end card; the
  preset ring now carries that space. The stack is still verifiable in the repo
  (`package.json`).
- The end-card chips are preset names (data), not testimonials — there is no social
  proof row because none exists to cite.
