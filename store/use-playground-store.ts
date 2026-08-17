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
  zoomLevel: number // 50 to 200

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
  setZoomLevel: (zoom: number) => void

  // history actions
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

export const usePlaygroundStore = create<PlaygroundState>((set, get) => ({
  // initial state
  text: "Hello GSAP!",
  animationConfig: { ...defaultAnimationConfig },
  backgroundConfig: { ...defaultBackgroundConfig },
  splitTextConfig: { ...defaultSplitTextConfig },
  activePresetId: null,
  isAnimating: false,
  selectedFramework: "react",
  selectedLanguage: "ts",
  activeTab: "presets",
  sidebarOpen: false,
  zoomLevel: 100,

  history: [
    {
      id: "init",
      timestamp: Date.now(),
      label: "Initial state",
      state: {
        text: "Hello GSAP!",
        animationConfig: { ...defaultAnimationConfig },
        backgroundConfig: { ...defaultBackgroundConfig },
        splitTextConfig: { ...defaultSplitTextConfig },
      },
    },
  ],
  historyIndex: 0,

  // helper to record history
  _recordHistory: (label: string, newState: { text: string; animationConfig: AnimationConfig; backgroundConfig: BackgroundConfig; splitTextConfig: SplitTextConfig }) => {
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
  setText: (text, label = "Update text") => {
    const state = get()
    const newState = { text, animationConfig: state.animationConfig, backgroundConfig: state.backgroundConfig, splitTextConfig: state.splitTextConfig }
    state._recordHistory(label, newState)
    set({ text })
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
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),

  // History navigation
  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex > 0) {
      const target = history[historyIndex - 1]
      set({
        historyIndex: historyIndex - 1,
        text: target.state.text,
        animationConfig: JSON.parse(JSON.stringify(target.state.animationConfig)),
        backgroundConfig: JSON.parse(JSON.stringify(target.state.backgroundConfig)),
        splitTextConfig: JSON.parse(JSON.stringify(target.state.splitTextConfig)),
      })
    }
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex < history.length - 1) {
      const target = history[historyIndex + 1]
      set({
        historyIndex: historyIndex + 1,
        text: target.state.text,
        animationConfig: JSON.parse(JSON.stringify(target.state.animationConfig)),
        backgroundConfig: JSON.parse(JSON.stringify(target.state.backgroundConfig)),
        splitTextConfig: JSON.parse(JSON.stringify(target.state.splitTextConfig)),
      })
    }
  },

  jumpToHistory: (index) => {
    const { history } = get()
    if (index >= 0 && index < history.length) {
      const target = history[index]
      set({
        historyIndex: index,
        text: target.state.text,
        animationConfig: JSON.parse(JSON.stringify(target.state.animationConfig)),
        backgroundConfig: JSON.parse(JSON.stringify(target.state.backgroundConfig)),
        splitTextConfig: JSON.parse(JSON.stringify(target.state.splitTextConfig)),
      })
    }
  },

  clearHistory: () => {
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
      filter: preset.animationConfig.filter ?? defaultAnimationConfig.filter,
      fromValues: preset.animationConfig.fromValues ?? defaultAnimationConfig.fromValues,
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
      animationConfig: { ...defaultAnimationConfig },
      backgroundConfig: { ...defaultBackgroundConfig },
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
