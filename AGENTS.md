# TExP — Text Animation Generator

Single-page Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind v4 + shadcn/ui playground that previews and exports GSAP text animations. Not a monorepo.

**Design system:** `DESIGN.md` is the single source of truth ("Obsidian Instrument" — obsidian surfaces, Archivo + JetBrains Mono, ONE acid-lime accent meaning live/selected/focused, logo always black/white). Tokens are OKLCH values in `app/globals.css` bridged via `@theme inline`; never hardcode palette hexes or Tailwind color-number classes in feature components.

## Commands

- `npm run dev` — start dev server on `:3000`.
- `npm run build` — production build (`next build`).
- `npm run start` — run built app.
- `npm run lint` — `next lint`. No ESLint config exists in repo; first run will prompt to set one up. `typescript.ignoreBuildErrors: true` is set in `next.config.mjs` (no `eslint` key anymore), so builds pass even with TS errors — always verify with a real typecheck.
- Typecheck: there is **no** `typecheck` script. Run `npx tsc --noEmit` directly; the project does not have one wired into `package.json`.
- Tests: **no test framework** (no jest/vitest/playwright in `package.json`). Don't invent `npm test`.

## Layout

- `app/` — App Router entry. `app/page.tsx` is the only route; `app/layout.tsx` registers ~80 Google Fonts via `next/font/google` (large, slow first build) and wraps in `ThemeProvider`.
- `components/` — feature components (animation/background/CSS/split-text controls, `preview-canvas.tsx`, `code-dialog.tsx`, timeline-* components) and shadcn primitives in `components/ui/`.
- `store/use-playground-store.ts` — Zustand store for the Text mode: all app state lives here (text, animation/background/split configs, active tab, framework/language). Defaults exported as `defaultAnimationConfig`, `defaultBackgroundConfig`, `defaultSplitTextConfig`. `isAnimating` lives here too — it is the single source of truth for playback state (PreviewCanvas writes it; Play button / Layers badge read it).
- `store/use-timeline-store.ts` — two stores for Timeline mode: `useTimelineProjectStore` (project data + `revision` counter that triggers GSAP rebuilds) and `useTimelineUiStore` (selection/playhead/zoom).
- `lib/animation-engine.ts` — framework-free GSAP engine shared by both previews and both export paths (`computeTextStyles`, `splitTextIntoElements`, `resetAndPrepareElement`, `buildTweenVars`, `runTextTween`, …). Keep it free of React/store imports.
- `types/animation.ts` — `AnimationConfig`, `BackgroundConfig`, `SplitTextConfig`, `Preset`, `CodeGenerationParams`; `types/timeline.ts` reuses them.
- `lib/presets.ts` — 20+ animation presets (`ANIMATION_PRESETS`, `PRESET_CATEGORIES`).
- `lib/fonts.ts` — list of Google Font keys; mirror of the registrations in `app/layout.tsx`.
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge).
- `utils/code-generator.ts` — `generateCode(params)` returns `{ animation, complete }` strings for vanilla/react/vue × js/ts. Consumes the same store state.
- `utils/timeline-builder.ts` / `utils/timeline-code-generator.ts` — layout/validation/GSAP construction and code export for Timeline mode.
- `hooks/` — `use-mobile`, `use-toast` (shadcn boilerplate).
- `public/` — logos and placeholder assets.

## Path aliases

`@/*` → repo root (see `tsconfig.json`). shadcn aliases in `components.json`: `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`.

## Key conventions

- The whole UI is one client component tree starting at `app/page.tsx` (`"use client"`). `PreviewCanvas` is the only imperative surface: it forwards a ref with `playAnimation()` and `resetAnimation()`. `app/page.tsx` and `preset-selector.tsx` call that ref.
- `PreviewCanvas` reads store slices individually (`usePlaygroundStore((s) => s.x)`) and mirrors the latest values into refs so the imperative `playAnimation`/`resetAnimation` never see stale closures. Playback guard reads `usePlaygroundStore.getState().isAnimating` at call time. Keep that pattern when adding new controls.
- Split-text DOM is generated inside one removable `<span class="split-root" style="display:contents">` wrapper per element; tear it down with `clearSplitElements()` so React-owned plain-text siblings are never destroyed manually.
- The sequencer owns timing in Timeline mode: per-item `animation.delay` is stripped by `buildGsapTimeline` and excluded from `itemCycleDuration`; use positions/offsets instead.
- Presets preserve the user's current `customStyles` when applied — only fields a preset explicitly sets are overridden (see `applyPreset` in the store).
- Code export strings are built in `utils/code-generator.ts`; it has its own copy of font-size/weight/etc. maps that must stay in sync with `lib/animation-engine.ts` (the authoritative maps live there).
- Tailwind v4 via `@tailwindcss/postcss` (`postcss.config.mjs`). Theme tokens are HSL CSS variables in `app/globals.css` (`:root` and `.dark`) bridged through `@theme inline`.

## Things likely to surprise an agent

- README claims "Next.js 14 / React 18" and says `cd gsap-playground` — actual deps are Next 16.x and React 19, and the folder/package is `TExP`/`TEXP`. Update README, not the deps.
- Both `pnpm-lock.yaml` and `package-lock.json` are committed. npm is the documented choice; pick one lockfile and stick with it; mixing install tools causes drift.
- No CI workflows under `.github/`. Only `skills/` (agent skill bundles) live there. No `CLAUDE.md`, `.cursorrules`, or copilot instructions exist yet.
- Dev server hot-reload is slow on first start because `app/layout.tsx` registers ~80 Google Fonts; expect long initial compile.
- Text-mode history coalesces rapid text edits (~600 ms debounce) into a single "Update text" entry; other recorded actions flush the pending entry first to keep ordering.
