"use client";

import { useRef, useEffect, useImperativeHandle, forwardRef, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import { useTheme } from "next-themes";
import type { BackgroundConfig } from "@/types/animation";
import {
  allStyleKeys,
  clearSplitElements,
  computeTextStyles,
  resetAndPrepareElement,
  resolveTargets,
  runTextTween,
  splitTextIntoElements,
} from "@/lib/animation-engine";
import { usePlaygroundStore } from "@/store/use-playground-store";

export interface PreviewCanvasRef {
  playAnimation: () => void;
  resetAnimation: () => void;
}

const PreviewCanvas = forwardRef<PreviewCanvasRef>((_props, ref) => {
  const textRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Subscribe to store slices individually to minimize re-renders.
  // isAnimating lives ONLY here (single source of truth) — the Play button,
  // the Layers panel badge and the canvas guard all read the same value.
  const text = usePlaygroundStore((s) => s.text);
  const animationConfig = usePlaygroundStore((s) => s.animationConfig);
  const backgroundConfig = usePlaygroundStore((s) => s.backgroundConfig);
  const splitTextConfig = usePlaygroundStore((s) => s.splitTextConfig);
  const setIsAnimating = usePlaygroundStore((s) => s.setIsAnimating);

  // Use refs to always have latest values for imperative methods (avoids stale closures)
  const animationConfigRef = useRef(animationConfig);
  const splitTextConfigRef = useRef(splitTextConfig);
  const textValueRef = useRef(text);
  animationConfigRef.current = animationConfig;
  splitTextConfigRef.current = splitTextConfig;
  textValueRef.current = text;

  // Build computed styles from config via the shared engine (memoized)
  const computedStyles = useMemo(
    () => computeTextStyles(animationConfig.customStyles),
    [animationConfig.customStyles]
  );

  // Keep a ref to the latest computedStyles so imperative methods stay fresh
  const computedStylesRef = useRef(computedStyles);
  computedStylesRef.current = computedStyles;

  // Imperative methods read from refs + fresh store snapshot so they're never stale
  const resetAnimation = useCallback(() => {
    if (!textRef.current) return;
    resetAndPrepareElement(textRef.current, computedStylesRef.current, textValueRef.current, splitTextConfigRef.current);
    usePlaygroundStore.getState().setIsAnimating(false);
  }, []);

  const playAnimation = useCallback(() => {
    if (!textRef.current) return;
    // Guard against double-play using the live store value, not a closure
    if (usePlaygroundStore.getState().isAnimating) return;
    setIsAnimating(true);

    // Read fresh values from refs
    const cfg = animationConfigRef.current;
    const stc = splitTextConfigRef.current;

    // Reset + styles + split DOM (shared engine)
    resetAndPrepareElement(textRef.current, computedStylesRef.current, textValueRef.current, stc);

    const targets = resolveTargets(textRef.current, stc);
    if (!targets) {
      setIsAnimating(false);
      return;
    }

    runTextTween(targets as gsap.TweenTarget, cfg, stc, () => setIsAnimating(false));
  }, [setIsAnimating]);

  // Stable imperative handle — methods read from refs so they're never stale
  useImperativeHandle(ref, () => ({
    playAnimation: () => playAnimation(),
    resetAnimation: () => resetAnimation(),
  }));

  // Apply inline styles to textRef whenever computedStyles change.
  // Runs BEFORE the split effect below so "lines" mode measures with final styles.
  useEffect(() => {
    if (!textRef.current) return;
    // Clear all style keys first to remove stale values
    for (const key of allStyleKeys) {
      textRef.current.style[key as any] = "";
    }
    // Apply fresh computed styles
    Object.assign(textRef.current.style, computedStyles);
  }, [computedStyles]);

  // Apply text + split — use DOM manipulation only for split, React for normal
  useEffect(() => {
    if (!textRef.current) return;
    if (splitTextConfig.enabled) {
      // For split text, set text content first then split
      textRef.current.textContent = text;
      splitTextIntoElements(textRef.current, splitTextConfig.type);
    } else {
      // Tearing down: remove leftover split DOM. React's plain-text node
      // (rendered below) is never touched, so no duplication occurs.
      clearSplitElements(textRef.current);
    }
  }, [text, splitTextConfig, computedStyles]);

  const getBackgroundStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};

    if (backgroundConfig.type === "solid") {
      // "auto" means follow theme
      if (backgroundConfig.color === "auto") {
        // Don't set — let CSS variable handle it
      } else {
        style.backgroundColor = backgroundConfig.color;
      }
    } else if (backgroundConfig.type === "gradient") {
      const { type, colors, direction } = backgroundConfig.gradient;
      style.background = type === "radial"
        ? `radial-gradient(circle, ${colors.join(", ")})`
        : `linear-gradient(${direction}, ${colors.join(", ")})`;
    } else if (backgroundConfig.type === "image" && backgroundConfig.image) {
      style.backgroundImage = `url("${backgroundConfig.image}")`;
      style.backgroundSize = "cover";
      style.backgroundPosition = "center";
      style.backgroundRepeat = "no-repeat";
    }

    return style;
  };

  // Read overflow settings as separate subscriptions so toggling overflow
  // doesn't cause textRef or GSAP state to be touched
  const overflowHidden = usePlaygroundStore((s) => s.animationConfig.customStyles.overflowHidden);
  const containerOverflow = usePlaygroundStore((s) => s.animationConfig.customStyles.containerOverflow);

  const isAutoBackground = backgroundConfig.type === "solid" && backgroundConfig.color === "auto";

  return (
    <div className="w-full h-full flex flex-col">
      {/* Full-bleed artboard surface — borderless, fills the workspace */}
      <div
        className={`relative flex-1 flex items-center justify-center transition-colors ${
          isAutoBackground
            ? "bg-canvas-bg canvas-grid"
            : ""
        } ${containerOverflow ? "overflow-hidden" : "overflow-visible"}`}
        style={isAutoBackground ? {} : getBackgroundStyle()}
      >
          {/* Overflow wrapper — clips animated text when overflowHidden is on */}
          <div
            style={{
              overflow: overflowHidden ? "hidden" : "visible",
            }}
          >
            <div
              ref={textRef}
              className="text-center select-none"
              style={{
                willChange: "transform, opacity, filter",
                color: animationConfig.customStyles.color === "inherit"
                  ? (isAutoBackground ? "var(--canvas-text)" : undefined)
                  : undefined,
                ...computedStyles,
              }}
            >
              {/* Only render text directly when split is NOT enabled */}
              {!splitTextConfig.enabled && text}
            </div>
          </div>
        </div>
      </div>
  );
});

PreviewCanvas.displayName = "PreviewCanvas";

export default PreviewCanvas;
