# TExP — Text Animation Generator

Single-page Next.js 15 (App Router) + React 19 + TypeScript + Tailwind + shadcn/ui playground that previews and exports GSAP text animations. Not a monorepo.

## Commands

- `npm run dev` — start dev server on `:3000`.
- `npm run build` — production build (`next build`).
- `npm run start` — run built app.
- `npm run lint` — `next lint`. No ESLint config exists in repo; first run will prompt to set one up. Build intentionally skips lint and TS errors (see `next.config.mjs`).
- Typecheck: there is **no** `typecheck` script. Run `npx tsc --noEmit` directly; the project does not have one wired into `package.json`.
- Tests: **no test framework** (no jest/vitest/playwright in `package.json`). Don't invent `npm test`.

`next.config.mjs` sets `eslint.ignoreDuringBuilds: true`, `typescript.ignoreBuildErrors: true`, `images.unoptimized: true` — builds pass even with TS/lint errors.

## Layout

- `app/` — App Router entry. `app/page.tsx` is the only route; `app/layout.tsx` registers ~80 Google Fonts via `next/font/google` (large, slow first build) and wraps in `ThemeProvider`.
- `components/` — feature components (animation/background/CSS/split-text controls, `preview-canvas.tsx`, `code-dialog.tsx`, etc.) and shadcn primitives in `components/ui/`.
- `store/use-playground-store.ts` — Zustand store. All app state lives here (text, animation/background/split configs, active tab, framework/language, presets). Defaults exported as `defaultAnimationConfig`, `defaultBackgroundConfig`, `defaultSplitTextConfig`.
- `types/animation.ts` — `AnimationConfig`, `BackgroundConfig`, `SplitTextConfig`, `Preset`, `CodeGenerationParams`.
- `lib/presets.ts` — 20+ animation presets (`ANIMATION_PRESETS`, `PRESET_CATEGORIES`).
- `lib/fonts.ts` — list of Google Font keys; mirror of the registrations in `app/layout.tsx`.
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge).
- `utils/code-generator.ts` — `generateCode(params)` returns `{ animation, complete }` strings for vanilla/react/vue × js/ts. Consumes the same store state.
- `hooks/` — `use-mobile`, `use-toast` (shadcn boilerplate).
- `public/` — logos and placeholder assets.

## Path aliases

`@/*` → repo root (see `tsconfig.json`). shadcn aliases in `components.json`: `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`.

## Key conventions

- The whole UI is one client component tree starting at `app/page.tsx` (`"use client"`). `PreviewCanvas` is the only imperative surface: it forwards a ref with `playAnimation()` and `resetAnimation()`. `app/page.tsx` is the only caller of that ref.
- `PreviewCanvas` reads store slices individually (`usePlaygroundStore((s) => s.x)`) and mirrors the latest values into refs so the imperative `playAnimation`/`resetAnimation` never see stale closures. Keep that pattern when adding new controls.
- Presets preserve the user's current `customStyles` when applied — only fields a preset explicitly sets are overridden (see `applyPreset` in the store).
- Code export strings are built in `utils/code-generator.ts`; it has its own copy of font-size/weight/etc. maps that must stay in sync with `preview-canvas.tsx` and `app/globals.css` token names.
- Tailwind v3. `postcss.config.mjs` only loads `tailwindcss` (no `autoprefixer` plugin — `autoprefixer` is in `dependencies` but unused in PostCSS).
- shadcn base color is `neutral`; theme tokens live as HSL CSS variables in `app/globals.css` (`:root` and `.dark`).

## Known dead/orphan code (do not assume it's wired up)

- `styles/globals.css` — older shadcn default theme. **Not imported anywhere**; the active stylesheet is `app/globals.css`. Safe to delete.
- `components/preview-canvas-new.tsx` — superseded by `components/preview-canvas.tsx`. Not imported.
- `components/code-generator.tsx` — UI wrapper around `utils/code-generator.ts`; both files exist with the same name in different dirs (tsx vs ts). Both are used: the dialog imports the `.tsx` wrapper, which calls the `.ts` logic.

## Things likely to surprise an agent

- README claims "Next.js 14 / React 18" — actual deps are Next 15.2.8 and React 19. Update README, not the deps.
- README's install instructions say `cd gsap-playground` — directory name in the repo is `TExP` (package name) and `TEXP` (case-insensitive folder). Don't rename to match README.
- Both `pnpm-lock.yaml` and `package-lock.json` are committed. npm is the documented choice; the npm lockfile is stale-ish but kept. Pick one lockfile and stick with it; mixing install tools causes drift.
- No CI workflows under `.github/`. Only `skills/` (agent skill bundles) live there. No `CLAUDE.md`, `.cursorrules`, or copilot instructions exist yet.
- A `dev` banner in `app/page.tsx` says "🚧 Development in progress" — keep it until release.
- Dev server hot-reload is slow on first start because `app/layout.tsx` registers ~80 Google Fonts; expect long initial compile.
