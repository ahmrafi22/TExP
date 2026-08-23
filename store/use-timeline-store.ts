import { create } from "zustand"
import type { TimelineItem, TimelineLabel, TimelinePos, TimelineProject } from "@/types/timeline"
import { computeLayout } from "@/utils/timeline-builder"
import {
  defaultAnimationConfig,
  defaultSplitTextConfig,
} from "@/store/use-playground-store"

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

/** Recomputes derived fields (totalDuration) — never stored manually. */
function withDerived(project: TimelineProject): TimelineProject {
  return { ...project, totalDuration: computeLayout(project).totalDuration }
}

/** Even vertical slot for the nth item — keeps the default stack tidy. */
function slotPos(index: number, total: number): TimelinePos {
  const yp = total <= 1 ? 0 : ((index + 0.5) / total) * 72 - 36
  return { xp: 0, yp: Math.round(yp * 100) / 100 }
}

function clampPos(n: number): number {
  return Math.min(48, Math.max(-48, Math.round(n * 100) / 100))
}

function sanitizePos(raw: unknown): TimelinePos | undefined {
  if (!raw || typeof raw !== "object") return undefined
  const p = raw as { xp?: unknown; yp?: unknown }
  if (typeof p.xp !== "number" || typeof p.yp !== "number") return undefined
  return { xp: clampPos(p.xp), yp: clampPos(p.yp) }
}

function makeItem(partial: Omit<TimelineItem, "id" | "order">, order: number): TimelineItem {
  return { ...clone(partial), id: uid("tl-item"), order }
}

// ── Defaults ──────────────────────────────────────────────────────────────────

function defaultProject(): TimelineProject {
  const intro = makeItem(
    {
      label: "Intro · Bounce In",
      text: "Hello GSAP!",
      animation: {
        ...clone(defaultAnimationConfig),
        tweenType: "from",
        y: -100,
        scale: 0.3,
        opacity: 0,
        duration: 0.9,
        ease: "bounce.out",
      },
      splitTextConfig: { ...clone(defaultSplitTextConfig), enabled: true, type: "chars", stagger: 0.06 },
      duration: 1,
      position: { type: "start" },
    },
    0,
  )

  const sequel = makeItem(
    {
      label: "Sequel · Slide Up",
      text: "Composed with the Timeline Creator",
      animation: {
        ...clone(defaultAnimationConfig),
        tweenType: "from",
        y: 80,
        opacity: 0,
        duration: 0.7,
        ease: "expo.out",
      },
      splitTextConfig: { ...clone(defaultSplitTextConfig), enabled: true, type: "words", stagger: 0.05 },
      duration: 1,
      position: { type: "afterPrevious", offset: 0.25 },
    },
    1,
  )

  return withDerived({
    id: uid("tl-project"),
    name: "Untitled Timeline",
    items: [
      { ...intro, pos: { xp: -12, yp: -18 } },
      { ...sequel, pos: { xp: 8, yp: 22 } },
    ],
    labels: [],
    repeat: 0,
    repeatDelay: 0,
    yoyo: false,
    totalDuration: 0,
  })
}

/**
 * Coerces an (untrusted) imported project object into a valid TimelineProject.
 * Items missing required fields are dropped; ids are de-duplicated so GSAP
 * target maps stay keyed correctly.
 */
function sanitizeImportedProject(raw: Partial<TimelineProject>): TimelineProject {
  const seen = new Set<string>()
  const items = (Array.isArray(raw.items) ? raw.items : []).flatMap((item, i): TimelineItem[] => {
    if (!item || typeof item !== "object") return []
    if (!item.animation || typeof item.animation !== "object") return []
    if (!item.animation.customStyles || typeof item.animation.customStyles !== "object") return []
    let id = typeof item.id === "string" && item.id ? item.id : uid("tl-item")
    while (seen.has(id)) id = `${id}-${Math.random().toString(36).substring(2, 6)}`
    seen.add(id)
    return [{
      ...clone(defaultItemShape),
      ...clone(item),
      id,
      label: typeof item.label === "string" && item.label ? item.label : `Item ${i + 1}`,
      text: typeof item.text === "string" ? item.text : "",
      duration: typeof item.duration === "number" && item.duration > 0 ? item.duration : 1,
      position: item.position && typeof item.position === "object" ? item.position : { type: "afterPrevious", offset: 0 },
      order: 0, // re-numbered by mutate()
      splitTextConfig: item.splitTextConfig && typeof item.splitTextConfig === "object"
        ? item.splitTextConfig
        : clone(defaultSplitTextConfig),
      pos: sanitizePos(item.pos),
    }]
  })

  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : uid("tl-project"),
    name: typeof raw.name === "string" && raw.name ? raw.name : "Imported Timeline",
    items,
    labels: (Array.isArray(raw.labels) ? raw.labels : []).filter(
      (l): l is TimelineLabel => !!l && typeof l.name === "string" && typeof l.time === "number",
    ),
    repeat: typeof raw.repeat === "number" ? raw.repeat : 0,
    repeatDelay: typeof raw.repeatDelay === "number" ? raw.repeatDelay : 0,
    yoyo: !!raw.yoyo,
    totalDuration: 0,
  }
}

const defaultItemShape: Omit<TimelineItem, "id"> = {
  label: "Item",
  text: "",
  animation: defaultAnimationConfig, // replaced by clone() at use sites
  splitTextConfig: defaultSplitTextConfig,
  duration: 1,
  position: { type: "afterPrevious", offset: 0 },
  order: 0,
}

export const emptyProject = (): TimelineProject => ({
  id: uid("tl-project"),
  name: "Untitled Timeline",
  items: [],
  labels: [],
  repeat: 0,
  repeatDelay: 0,
  yoyo: false,
  totalDuration: 0,
})

// ── Project store (persisted working data) ────────────────────────────────────

interface TimelineProjectState {
  project: TimelineProject
  revision: number // bumped on every data mutation → controls GSAP rebuilds

  // Item CRUD
  addItem: (item: Omit<TimelineItem, "id" | "order">) => string
  updateItem: (id: string, patch: Partial<TimelineItem>) => void
  removeItem: (id: string) => void
  reorderItems: (fromIndex: number, toIndex: number) => void
  duplicateItem: (id: string) => string | null

  // Labels
  addLabel: (name: string, time: number) => void
  updateLabel: (id: string, patch: Partial<TimelineLabel>) => void
  removeLabel: (id: string) => void

  // Timeline-level settings
  updateSettings: (patch: Partial<Pick<TimelineProject, "repeat" | "repeatDelay" | "yoyo" | "name">>) => void

  // Derived / lifecycle
  recomputeTotalDuration: () => void
  resetProject: () => void
  clearProject: () => void
  loadProject: (project: TimelineProject) => void
}

function mutate(state: TimelineProjectState, fn: (draft: TimelineProject) => void): Partial<TimelineProjectState> {
  const draft = clone(state.project)
  fn(draft)
  // keep `order` a dense 0..n-1 sequence mirroring array position
  draft.items.forEach((item, i) => (item.order = i))
  return { project: withDerived(draft), revision: state.revision + 1 }
}

export const useTimelineProjectStore = create<TimelineProjectState>((set, get) => ({
  project: defaultProject(),
  revision: 0,

  addItem: (partial) => {
    const id = uid("tl-item")
    set((state) =>
      mutate(state, (draft) => {
        draft.items.push({
          ...clone(partial),
          id,
          order: draft.items.length,
          pos: partial.pos ?? slotPos(draft.items.length, draft.items.length + 1),
        })
      }),
    )
    return id
  },

  updateItem: (id, patch) =>
    set((state) =>
      mutate(state, (draft) => {
        const item = draft.items.find((i) => i.id === id)
        if (item) Object.assign(item, clone(patch))
      }),
    ),

  removeItem: (id) =>
    set((state) =>
      mutate(state, (draft) => {
        draft.items = draft.items.filter((i) => i.id !== id)
      }),
    ),

  reorderItems: (fromIndex, toIndex) =>
    set((state) =>
      mutate(state, (draft) => {
        if (fromIndex < 0 || fromIndex >= draft.items.length) return
        const clamped = Math.min(draft.items.length - 1, Math.max(0, toIndex))
        const [moved] = draft.items.splice(fromIndex, 1)
        draft.items.splice(clamped, 0, moved)
      }),
    ),

  duplicateItem: (id) => {
    const source = get().project.items.find((i) => i.id === id)
    if (!source) return null
    const newId = uid("tl-item")
    set((state) =>
      mutate(state, (draft) => {
        const index = draft.items.findIndex((i) => i.id === id)
        const copy = clone(source)
        copy.id = newId
        copy.label = `${source.label} copy`
        // place the duplicate right after the source so it plays next,
        // slightly offset on the artboard so both stay visible
        copy.position =
          source.position.type === "atTime"
            ? { type: "atTime", time: source.position.time + 0.5 }
            : { type: "afterPrevious", offset: 0.1 }
        copy.pos = {
          xp: clampPos((source.pos?.xp ?? 0) + 6),
          yp: clampPos((source.pos?.yp ?? 0) + 10),
        }
        draft.items.splice(index + 1, 0, copy)
      }),
    )
    return newId
  },

  addLabel: (name, time) =>
    set((state) =>
      mutate(state, (draft) => {
        if (!name.trim()) return
        if (draft.labels.some((l) => l.name === name)) return
        draft.labels.push({ id: uid("tl-label"), name, time })
      }),
    ),

  updateLabel: (id, patch) =>
    set((state) =>
      mutate(state, (draft) => {
        const label = draft.labels.find((l) => l.id === id)
        if (label) Object.assign(label, patch)
      }),
    ),

  removeLabel: (id) =>
    set((state) =>
      mutate(state, (draft) => {
        draft.labels = draft.labels.filter((l) => l.id !== id)
      }),
    ),

  updateSettings: (patch) =>
    set((state) =>
      mutate(state, (draft) => {
        Object.assign(draft, patch)
      }),
    ),

  recomputeTotalDuration: () =>
    set((state) => ({ project: withDerived(state.project) })),

  resetProject: () => set({ project: defaultProject(), revision: get().revision + 1 }),

  clearProject: () => set({ project: emptyProject(), revision: get().revision + 1 }),

  loadProject: (project) =>
    set((state) => {
      const clean = sanitizeImportedProject(project)
      return {
        project: withDerived(clean),
        revision: state.revision + 1,
      }
    }),
}))

// ── UI store (selection / playback / editor prefs — never persisted) ─────────

type ExportFramework = "vanilla" | "react" | "vue"
type ExportLanguage = "js" | "ts"

interface TimelineUiState {
  selectedItemId: string | null
  isPlaying: boolean
  currentTime: number
  zoomLevel: number       // pixels per second on the ruler
  snapEnabled: boolean
  speed: number           // timeScale multiplier
  exportFramework: ExportFramework
  exportLanguage: ExportLanguage
  // Live artboard-drag position — mirrored here (not the project store) so the
  // inspector can show values updating in real time without rebuilding GSAP.
  liveItemPos: { id: string; xp: number; yp: number } | null

  setSelectedItem: (id: string | null) => void
  setIsPlaying: (playing: boolean) => void
  setCurrentTime: (time: number) => void
  setZoomLevel: (zoom: number) => void
  setSnapEnabled: (enabled: boolean) => void
  setSpeed: (speed: number) => void
  setExportFramework: (fw: ExportFramework) => void
  setExportLanguage: (lang: ExportLanguage) => void
  setLiveItemPos: (pos: { id: string; xp: number; yp: number } | null) => void
}

export const useTimelineUiStore = create<TimelineUiState>((set) => ({
  selectedItemId: null,
  isPlaying: false,
  currentTime: 0,
  zoomLevel: 90,
  snapEnabled: true,
  speed: 1,
  exportFramework: "vanilla",
  exportLanguage: "ts",
  liveItemPos: null,

  setSelectedItem: (id) => set({ selectedItemId: id }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setZoomLevel: (zoom) => set({ zoomLevel: Math.min(400, Math.max(12, zoom)) }),
  setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),
  setSpeed: (speed) => set({ speed }),
  setExportFramework: (fw) => set({ exportFramework: fw }),
  setExportLanguage: (lang) => set({ exportLanguage: lang }),
  setLiveItemPos: (pos) => set({ liveItemPos: pos }),
}))
