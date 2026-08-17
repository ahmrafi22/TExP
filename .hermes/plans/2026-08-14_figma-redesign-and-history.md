# Figma-Style UI Redesign & History System Implementation Plan

> **Goal:** Revamp TExP into a modern Figma-like design with a professional dark theme, left layers/history/presets panel, top canvas toolbar, central artboard with zoom/grid controls, right inspector properties panel, and a full History/Undo/Redo system tracking all user actions.

## Key Features & Enhancements

1. **History & Action Log System ("Things What Was Done")**:
   - Time-travel undo/redo stack (`Ctrl+Z`, `Ctrl+Y`).
   - History tab in the left sidebar displaying a timeline log of user actions (e.g. *"Changed Font Size to 5xl"*, *"Applied Preset 'Bounce'"*, *"Updated Text"*).
   - Ability to click any past step in history to revert or preview that state.

2. **Figma-Like Layout & Aesthetic**:
   - **Top Toolbar**: File/Project title, undo/redo quick triggers, canvas mode tools (select, pan/zoom, fit artboard), play/reset controls, export code button.
   - **Left Sidebar**: 3 tabs — **Layers** (DOM element hierarchy tree), **Presets** (curated templates), **History** (action log & time-travel).
   - **Central Artboard Canvas**: Figma-style canvas with dot grid / dark canvas, zoom controls (50% - 200%, Fit), selection bounds, and live GSAP animation preview.
   - **Right Inspector Panel**: Collapsible Figma inspector sections (Text & Typography, GSAP Animation Properties, Transforms & Filters, Split Text, Background Fill).

3. **Polished Dark Theme & Glassmorphism**:
   - Deep neutral backgrounds (`#090a0f`, `#12141d`, `#1a1d2b`), sleek borders (`rgba(255,255,255,0.08)`), glowing accents, tabular numeric badges, custom scrollbars.

---

## File Changes Overview

1. `types/animation.ts` — Add `HistoryEntry` and store history interfaces.
2. `store/use-playground-store.ts` — Implement history snapshot stack, `undo()`, `redo()`, `jumpToHistory()`, and auto-logging on state changes.
3. `components/history-panel.tsx` — Create Figma-style History timeline & action log panel.
4. `components/layers-panel.tsx` — Create Figma-style element tree view panel.
5. `components/preview-canvas.tsx` — Add canvas bounds, zoom support, selection indicators.
6. `app/globals.css` — Add Figma-like styling, dot-grid background, glass utilities, custom scrollbars.
7. `app/page.tsx` — Assemble full Figma layout shell with top bar, left panel, central artboard, and right inspector.
