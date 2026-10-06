# TEXP — Text Animation Generator

<div align="center">
  
![TEXP Logo](./public/logo-white.svg)

### Professional Text Animation Generator Powered by GSAP

[![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)](https://github.com/ahmrafi22/TExP)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?style=flat-square&logo=greensock)](https://greensock.com/)

---

### Built With

[![Tech Stack](https://go-skill-icons.vercel.app/api/icons?i=react,nextjs,typescript,tailwindcss,shadcn,gsap&perline=6)](https://skillicons.dev)

</div>

---

## 🎬 Launch Film & Demo

<div align="center">

<video src="./film/renders/texp-launch-film-1080p60.mp4" width="100%" controls autoplay loop muted playsinline></video>

<br />

[![Watch 1080p 60fps Film](https://img.shields.io/badge/▶_Launch_Film-1080p_60fps-BDF524?style=for-the-badge&logo=quicktime&logoColor=000000)](./film/renders/texp-launch-film-1080p60.mp4)
[![Music-Only Cut](https://img.shields.io/badge/🎵_Soundtrack_Cut-Music_Only-22272e?style=for-the-badge&logo=soundcharts&logoColor=ffffff)](./film/renders/texp-launch-film-music-only.mp4)

*A 24-second launch commercial showcasing real-time GSAP text animation, 27 built-in motion presets, fine-grain cubic-bezier curve editing, split-text character mechanics, and multi-track timeline sequencing.*

</div>

### Highlights from the Launch Film
- **Beat 1 — Elastic Pop & Macro Feel:** Instant character-by-character kinetic spring response.
- **Beat 2 & 3 — 27 Motion Presets:** Instant interactive previews (Bounce In, Zoom Rotate, 3D Flip, Wave, Glitch, etc.).
- **Beat 4 — 3D Kinetic Drum:** Live carousel switching between complex multi-stage text motions.
- **Beat 5 — Fine-Grain Curve Editor:** Custom cubic-bezier easing adjustments with real-time graph feedback.
- **Beat 6 — Split-Text Engine:** Granular isolation of chars, words, and lines with coordinate stagger overlays.
- **Beat 7 — Multi-Track Sequencer:** Precise timeline track positioning, layers, and playhead scrubbing.
- **Beat 8 — 1-Click Clean Code Export:** Immediate copy-paste production code for Vanilla JS, React, and Vue (JS & TS).

---

## About the Project

**TExP** is a modern, high-precision text animation playground that empowers designers and developers to create production-ready GSAP animations without writing boilerplate code. Built on the **Obsidian Instrument** design language with an acid-lime accent system, craft pixel-perfect text animations in seconds.

**Key Highlights:**
- **Real-Time Canvas Preview:** Instant GSAP engine playback with deterministic resets.
- **27 Built-In Motion Presets:** Curated library covering Bounce, 3D Flips, Waves, Glitches, Elastic Pops, and Typographic reveals.
- **Fine-Grain Curve Editor:** Visual cubic-bezier and preset easing curve editor with live handle manipulation.
- **Split-Text Engine:** Split text into chars, words, or lines with stagger, directional flow, and 3D transforms.
- **Multi-Track Sequencer:** Full timeline mode with layer sequencing, playhead scrubbing, and keyframe inspection.
- **71 Curated Google Fonts:** Real-time font loading and typographic pairing.
- **1-Click Production Code Export:** Clean, framework-idiomatic code output for Vanilla JS, React, and Vue in both JavaScript and TypeScript.

---

## Features

### Animation Engine
- **Tween Types:** `to`, `from`, `fromTo` GSAP tweens.
- **Easing System:** Full GSAP easing suite plus interactive cubic-bezier curve editor.
- **Transform Controls:** 3D rotations (`rotateX`, `rotateY`, `rotateZ`), scale, skew, x/y offsets, opacity, blur filter.
- **Timing Mechanics:** Precise duration, delay, repeat, yoyo, and character stagger controls.

### Split-Text Engine
- Split typography by **characters**, **words**, or **lines**.
- Customizable stagger delays and origin directions (start, center, end, edges, random).
- Clean DOM generation via non-destructive wrappers.

### Timeline Mode
- Multi-track timeline sequencing.
- Visual track items with draggable timing and offsets.
- Real-time playhead scrubber and loop preview.

### Export Options
- Generates clean, zero-bloat code directly usable in production apps.
- Target frameworks: **Vanilla JS**, **React**, **Vue**.
- Target languages: **TypeScript** and **JavaScript**.

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16 (App Router)** | React application framework |
| **React 19** | Modern UI primitives |
| **TypeScript** | Type-safe architecture |
| **Tailwind CSS v4** | Modern utility-first styling with OKLCH theme tokens |
| **shadcn/ui & Radix UI** | Accessible instrument controls and dialogs |
| **GSAP (GreenSock)** | Industry-standard animation engine |
| **Zustand** | Predictable playground and timeline state management |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/ahmrafi22/TExP.git

# Navigate to project
cd TExP

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

1. **Enter Text:** Type any text or headline into the central canvas input.
2. **Select a Preset:** Browse the 27 motion presets for instant, curated animations.
3. **Fine-Tune Properties:** Adjust duration, cubic-bezier curves, 3D rotations, and split-text stagger in the inspector panel.
4. **Sequence Tracks:** Switch to *Timeline Animation* mode to arrange multi-line choreographies.
5. **Export Code:** Click *Get Code* to copy production-ready GSAP code tailored to your preferred framework and language.

---

## License

MIT License — see [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with care for the motion design and web engineering community.

[Report an Issue](https://github.com/ahmrafi22/TExP/issues) • [GitHub Repository](https://github.com/ahmrafi22/TExP)

</div>
