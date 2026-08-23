import { create } from "zustand"
import type { AnimationConfig, BackgroundConfig, SplitTextConfig, HistoryEntry } from "@/types/animation"
import { ANIMATION_PRESETS } from "@/lib/presets"

// ── Default values ─────────────────────────────────────────────────────────────

export const defaultAnimationConfig: AnimationConfig = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  rotationX: 0,
  rotationY: 0,
  skewX: 0,
  skewY: 0,
  opacity: 1,
  duration: 1,
  delay: 0,
  ease: "power1.out",
  tweenType: "to",
  stagger: 0,
  repeat: 0,
  yoyo: false,
  filter: { type: "blur", value: 0 },
  fromValues: {
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1,
    filter: { type: "blur", value: 0 },
  },
  customStyles: {
    fontSize: "4xl",
    fontFamily: "inherit",
    fontWeight: "bold",
    letterSpacing: "normal",
    background: "transparent",
    color: "inherit",
    textDecoration: "none",
    textTransform: "none",
    lineHeight: "normal",
    overflowHidden: false,
    containerOverflow: false,
  },
}

export const defaultBackgroundConfig: BackgroundConfig = {
  type: "solid",
  color: "auto",
  gradient: {
    type: "linear",
    colors: ["#667eea", "#764ba2"],
    direction: "to right",
  },
  image: null,
}

export const defaultSplitTextConfig: SplitTextConfig = {
  enabled: false,
  type: "chars",
  stagger: 0.1,
  staggerFrom: "start",
}

// ── Store types ────────────────────────────────────────────────────────────────

interface PlaygroundState {
  // core state
  text: string
  animationConfig: AnimationConfig
  backgroundConfig: BackgroundConfig
  splitTextConfig: SplitTextConfig
  activePresetId: string | null
  isAnimating: boolean

  // history state
  history: HistoryEntry[]
  historyIndex: number

  // UI state
  selectedFramework: "vanilla" | "react" | "vue"
  selectedLanguage: "js" | "ts"
  activeTab: string
  sidebarOpen: boolean
  activeMode: "text" | "timeline" // top-level mode switcher

  // actions
  setText: (text: string, label?: string) => void
  setAnimationConfig: (config: AnimationConfig, label?: string) => void
  setBackgroundConfig: (config: BackgroundConfig, label?: string) => void
  setSplitTextConfig: (config: SplitTextConfig, label?: string) => void
  setActivePresetId: (id: string | null) => void
  setIsAnimating: (val: boolean) => void
  setSelectedFramework: (fw: "vanilla" | "react" | "vue") => void
  setSelectedLanguage: (lang: "js" | "ts") => void
  setActiveTab: (tab: string) => void
  setSidebarOpen: (open: boolean) => void
  setActiveMode: (mode: "text" | "timeline") => void

  // history actions
  _flushPendingTextHistory: () => void
  _pendingTextRecord?: boolean
  _textHistoryTimer?: ReturnType<typeof setTimeout> | null
  _recordHistory: (label: string, newState: { text: string; animationConfig: AnimationConfig; backgroundConfig: BackgroundConfig; splitTextConfig: SplitTextConfig }) => void
  undo: () => void
  redo: () => void
  jumpToHistory: (index: number) => void
  clearHistory: () => void

  // compound actions
  applyPreset: (presetId: string) => void
  resetAllSettings: () => void
  resetAnimationProperties: () => void
  resetCustomCSS: () => void
}

const MAX_HISTORY = 30
const TEXT_HISTORY_DEBOUNCE_MS = 600

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

export const usePlaygroundStore = create<PlaygroundState>((set, get) => ({
  // initial state
  // Deep-clone defaults so nested objects (fromValues, customStyles, filter,
  // gradient) are never shared with the module-level constants.
  text: "Hello GSAP!",
  animationConfig: deepClone(defaultAnimationConfig),
  backgroundConfig: deepClone(defaultBackgroundConfig),
  splitTextConfig: { ...defaultSplitTextConfig },
  activePresetId: null,
  isAnimating: false,
  selectedFramework: "react",
  selectedLanguage: "ts",
  activeTab: "presets",
  sidebarOpen: false,
  activeMode: "text",

  history: [
    {
      id: "init",
      timestamp: Date.now(),
      label: "Initial state",
      state: {
        text: "Hello GSAP!",
        animationConfig: deepClone(defaultAnimationConfig),
        backgroundConfig: deepClone(defaultBackgroundConfig),
        splitTextConfig: { ...defaultSplitTextConfig },
      },
    },
  ],
  historyIndex: 0,

  /**
   * Text edits fire per keystroke; without debouncing, typing a sentence floods
   * the whole 30-entry history. Edits are coalesced into one entry after a
   * short pause. The flush runs before every other recorded action (and before
   * undo/redo/jumps) so relative ordering is preserved.
   */
  _flushPendingTextHistory: () => {
    const s = get() as PlaygroundState & { _textHistoryTimer?: ReturnType<typeof setTimeout> | null }
    if (s._textHistoryTimer) {
      clearTimeout(s._textHistoryTimer)
      s._textHistoryTimer = null
    }
    if (s._pendingTextRecord) {
      s._pendingTextRecord = false
      s._recordHistory("Update text", {
        text: s.text,
        animationConfig: s.animationConfig,
        backgroundConfig: s.backgroundConfig,
        splitTextConfig: s.splitTextConfig,
      })
    }
  },

  // helper to record history
  _recordHistory: (label, newState) => {
    ;(get() as PlaygroundState & { _flushPendingTextHistory: () => void })._flushPendingTextHistory()
    const { history, historyIndex } = get()
    const sliced = history.slice(0, historyIndex + 1)
    if (sliced.length >= MAX_HISTORY) {
      sliced.shift()
    }
    const entry: HistoryEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      label,
      state: JSON.parse(JSON.stringify(newState)),
    }
    set({
      history: [...sliced, entry],
      historyIndex: sliced.length,
    })
  },

  // simple setters with history recording
  setText: (text) => {
    set({ text })
    const s = get() as PlaygroundState & { _textHistoryTimer?: ReturnType<typeof setTimeout> | null; _pendingTextRecord?: boolean }
    s._pendingTextRecord = true
    if (s._textHistoryTimer) clearTimeout(s._textHistoryTimer)
    s._textHistoryTimer = setTimeout(() => {
      ;(get() as PlaygroundState & { _flushPendingTextHistory: () => void })._flushPendingTextHistory()
    }, TEXT_HISTORY_DEBOUNCE_MS)
  },

  setAnimationConfig: (animationConfig, label = "Update animation properties") => {
    const state = get()
    const newState = { text: state.text, animationConfig, backgroundConfig: state.backgroundConfig, splitTextConfig: state.splitTextConfig }
    state._recordHistory(label, newState)
    set({ animationConfig })
  },

  setBackgroundConfig: (backgroundConfig, label = "Update background") => {
    const state = get()
    const newState = { text: state.text, animationConfig: state.animationConfig, backgroundConfig, splitTextConfig: state.splitTextConfig }
    state._recordHistory(label, newState)
    set({ backgroundConfig })
  },

  setSplitTextConfig: (splitTextConfig, label = "Update split text") => {
    const state = get()
    const newState = { text: state.text, animationConfig: state.animationConfig, backgroundConfig: state.backgroundConfig, splitTextConfig }
    state._recordHistory(label, newState)
    set({ splitTextConfig })
  },

  setActivePresetId: (id) => set({ activePresetId: id }),
  setIsAnimating: (val) => set({ isAnimating: val }),
  setSelectedFramework: (fw) => set({ selectedFramework: fw }),
  setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveMode: (mode) => set({ activeMode: mode }),

  // History navigation
  undo: () => {
    get()._flushPendingTextHistory()
    const { history, historyIndex } = get()
    if (historyIndex > 0) {
      const target = history[historyIndex - 1]
      set({
        historyIndex: historyIndex - 1,
        text: target.state.text,
        animationConfig: deepClone(target.state.animationConfig),
        backgroundConfig: deepClone(target.state.backgroundConfig),
        splitTextConfig: deepClone(target.state.splitTextConfig),
      })
    }
  },

  redo: () => {
    get()._flushPendingTextHistory()
    const { history, historyIndex } = get()
    if (historyIndex < history.length - 1) {
      const target = history[historyIndex + 1]
      set({
        historyIndex: historyIndex + 1,
        text: target.state.text,
        animationConfig: deepClone(target.state.animationConfig),
        backgroundConfig: deepClone(target.state.backgroundConfig),
        splitTextConfig: deepClone(target.state.splitTextConfig),
      })
    }
  },

  jumpToHistory: (index) => {
    get()._flushPendingTextHistory()
    const { history } = get()
    if (index >= 0 && index < history.length) {
      const target = history[index]
      set({
        historyIndex: index,
        text: target.state.text,
        animationConfig: deepClone(target.state.animationConfig),
        backgroundConfig: deepClone(target.state.backgroundConfig),
        splitTextConfig: deepClone(target.state.splitTextConfig),
      })
    }
  },

  clearHistory: () => {
    get()._flushPendingTextHistory()
    const state = get()
    const freshEntry: HistoryEntry = {
      id: "reset-" + Date.now(),
      timestamp: Date.now(),
      label: "Reset history",
      state: {
        text: state.text,
        animationConfig: JSON.parse(JSON.stringify(state.animationConfig)),
        backgroundConfig: JSON.parse(JSON.stringify(state.backgroundConfig)),
        splitTextConfig: JSON.parse(JSON.stringify(state.splitTextConfig)),
      },
    }
    set({ history: [freshEntry], historyIndex: 0 })
  },

  // compound actions
  applyPreset: (presetId) => {
    const preset = ANIMATION_PRESETS.find((p) => p.id === presetId)
    if (!preset) return

    const state = get()

    const newAnimConfig: AnimationConfig = {
      ...defaultAnimationConfig,
      ...preset.animationConfig,
      filter: preset.animationConfig.filter ?? deepClone(defaultAnimationConfig.filter),
      fromValues: preset.animationConfig.fromValues
        ? deepClone(preset.animationConfig.fromValues)
        : deepClone(defaultAnimationConfig.fromValues),
      customStyles: {
        ...state.animationConfig.customStyles,
        ...(preset.animationConfig.customStyles ?? {}),
      },
    }

    const newSplitConfig: SplitTextConfig = {
      enabled: preset.splitTextConfig.enabled ?? false,
      type: preset.splitTextConfig.type ?? "chars",
      stagger: preset.splitTextConfig.stagger ?? 0.1,
      staggerFrom: preset.splitTextConfig.staggerFrom ?? "start",
    }

    const newState = {
      text: state.text,
      animationConfig: newAnimConfig,
      backgroundConfig: state.backgroundConfig,
      splitTextConfig: newSplitConfig,
    }

    state._recordHistory(`Apply preset: ${preset.name}`, newState)

    set({
      animationConfig: newAnimConfig,
      splitTextConfig: newSplitConfig,
      activePresetId: presetId,
    })
  },

  resetAllSettings: () => {
    const state = get()
    const defState = {
      text: "Hello GSAP!",
      animationConfig: deepClone(defaultAnimationConfig),
      backgroundConfig: deepClone(defaultBackgroundConfig),
      splitTextConfig: { ...defaultSplitTextConfig },
    }
    state._recordHistory("Reset all settings", defState)
    set({
      ...defState,
      isAnimating: false,
      activePresetId: null,
    })
  },

  resetAnimationProperties: () => {
    const state = get()
    const newAnimConfig = {
      ...state.animationConfig,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
      skewX: 0,
      skewY: 0,
      opacity: 1,
      duration: 1,
      delay: 0,
      ease: "power1.out",
      tweenType: "to" as const,
      stagger: 0,
      repeat: 0,
      yoyo: false,
      filter: { type: "blur" as const, value: 0 },
      fromValues: {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
        skewX: 0,
        skewY: 0,
        opacity: 1,
        filter: { type: "blur" as const, value: 0 },
      },
    }
    const newState = {
      text: state.text,
      animationConfig: newAnimConfig,
      backgroundConfig: state.backgroundConfig,
      splitTextConfig: { ...defaultSplitTextConfig },
    }
    state._recordHistory("Reset animation properties", newState)
    set({
      animationConfig: newAnimConfig,
      splitTextConfig: { ...defaultSplitTextConfig },
      isAnimating: false,
      activePresetId: null,
    })
  },

  resetCustomCSS: () => {
    const state = get()
    const newAnimConfig = {
      ...state.animationConfig,
      customStyles: { ...defaultAnimationConfig.customStyles },
    }
    const newState = {
      text: state.text,
      animationConfig: newAnimConfig,
      backgroundConfig: state.backgroundConfig,
      splitTextConfig: state.splitTextConfig,
    }
    state._recordHistory("Reset typography/CSS", newState)
    set({
      animationConfig: newAnimConfig,
    })
  },
}))
