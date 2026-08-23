"use client"

import { useEffect, useRef } from "react"
import { driver } from "driver.js"
import type { DriveStep } from "driver.js"
import "driver.js/dist/driver.css"

const TOUR_KEY = "texp-tour-seen-v1"

/**
 * Returns the step definitions for the first-time tour.
 * Steps whose target element is not in the DOM (e.g. responsive / hidden on
 * small screens) are filtered out at runtime so the tour never breaks.
 */
function buildSteps(): DriveStep[] {
  const all: DriveStep[] = [
    {
      element: "#tour-header",
      popover: {
        title: "Welcome to TExP",
        description:
          "A visual instrument for designing GSAP text animations. Type, tweak, play — then export production-ready code.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#tour-text-input",
      popover: {
        title: "Text input",
        description: "Type the text you want to animate. The canvas updates immediately.",
        side: "bottom",
      },
    },
    {
      element: "#tour-left-tabs",
      popover: {
        title: "Layers, Presets & History",
        description:
          "Layers shows the current DOM structure. Presets are one-click animation recipes. History tracks every change you make.",
        side: "right",
      },
    },
    {
      element: "#tour-canvas",
      popover: {
        title: "The artboard",
        description:
          "This is the preview. Hit Play to see your animation, or drag the slider in the transport bar below to scrub through it.",
        side: "bottom",
      },
    },
    {
      element: "#tour-transport",
      popover: {
        title: "Playback controls",
        description:
          "Play / Reset / Clear. You can also press Space to play while the canvas is in focus.",
        side: "top",
      },
    },
    {
      element: "#tour-header-actions",
      popover: {
        title: "Export & theme",
        description:
          "Get Code exports your animation as a runnable React / Vue / vanilla JS snippet. The moon/sun icon toggles dark mode.",
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "#tour-mode",
      popover: {
        title: "Dual workspace",
        description:
          "Switch between the single-text editor and the Timeline Creator, where you can sequence multiple items with precise timing.",
        side: "bottom",
      },
    },
  ]

  // Filter out steps whose target isn't present in the current layout
  return all.filter(
    (s) => typeof document !== "undefined" && typeof s.element === "string" && document.querySelector(s.element),
  )
}

export function startTour() {
  const d = driver({
    animate: false,
    overlayColor: "oklch(0.148 0.006 260 / 0.75)",
    showProgress: true,
    progressText: "{{current}} of {{total}}",
    stagePadding: 8,
    smoothScroll: true,
    showButtons: ["next", "previous", "close"],
    steps: buildSteps(),
    popoverClass: "driver-tour",
    nextBtnText: "Next",
    prevBtnText: "Back",
    doneBtnText: "Done",
    onDestroyed: () => {
      try {
        localStorage.setItem(TOUR_KEY, "1")
      } catch {
        /* private browsing — ignore */
      }
    },
  })
  d.drive()
}

export default function OnboardingTour() {
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    try {
      if (localStorage.getItem(TOUR_KEY)) return
    } catch {
      /* private browsing — always show */
    }
    started.current = true
    // Delay slightly so the DOM is fully painted and positioned
    const timer = setTimeout(() => startTour(), 400)
    return () => clearTimeout(timer)
  }, [])

  return null
}