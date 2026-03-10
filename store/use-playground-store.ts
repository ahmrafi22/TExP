import { create } from "zustand"
import type { AnimationConfig, BackgroundConfig, SplitTextConfig } from "@/types/animation"
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

  // UI state
  selectedFramework: "vanilla" | "react" | "vue"
  selectedLanguage: "js" | "ts"
  activeTab: string
  sidebarOpen: boolean

  // actions
  setText: (text: string) => void
  setAnimationConfig: (config: AnimationConfig) => void
  setBackgroundConfig: (config: BackgroundConfig) => void
  setSplitTextConfig: (config: SplitTextConfig) => void
  setActivePresetId: (id: string | null) => void
  setIsAnimating: (val: boolean) => void
  setSelectedFramework: (fw: "vanilla" | "react" | "vue") => void
  setSelectedLanguage: (lang: "js" | "ts") => void
  setActiveTab: (tab: string) => void
  setSidebarOpen: (open: boolean) => void

  // compound actions
  applyPreset: (presetId: string) => void
  resetAllSettings: () => void
  resetAnimationProperties: () => void
  resetCustomCSS: () => void
}

// ── Store ──────────────────────────────────────────────────────────────────────

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

  // simple setters
  setText: (text) => set({ text }),
  setAnimationConfig: (config) => set({ animationConfig: config }),
  setBackgroundConfig: (config) => set({ backgroundConfig: config }),
  setSplitTextConfig: (config) => set({ splitTextConfig: config }),
  setActivePresetId: (id) => set({ activePresetId: id }),
  setIsAnimating: (val) => set({ isAnimating: val }),
  setSelectedFramework: (fw) => set({ selectedFramework: fw }),
  setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

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
      // Preserve user's current text styles; only override what the preset explicitly sets
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

    set({
      animationConfig: newAnimConfig,
      splitTextConfig: newSplitConfig,
      activePresetId: presetId,
    })
  },

  resetAllSettings: () => {
    set({
      animationConfig: { ...defaultAnimationConfig },
      backgroundConfig: { ...defaultBackgroundConfig },
      splitTextConfig: { ...defaultSplitTextConfig },
      text: "Hello GSAP!",
      isAnimating: false,
      activePresetId: null,
    })
  },

  resetAnimationProperties: () => {
    const state = get()
    set({
      animationConfig: {
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
      },
      splitTextConfig: { ...defaultSplitTextConfig },
      isAnimating: false,
      activePresetId: null,
    })
  },

  resetCustomCSS: () => {
    const state = get()
    set({
      animationConfig: {
        ...state.animationConfig,
        customStyles: { ...defaultAnimationConfig.customStyles },
      },
    })
  },
}))
