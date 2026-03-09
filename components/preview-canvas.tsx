"use client";

import { useRef, useEffect, useState, useImperativeHandle, forwardRef, useMemo } from "react";
import { gsap } from "gsap";
import { useTheme } from "next-themes";
import type { AnimationConfig, BackgroundConfig } from "@/types/animation";
import { googleFonts } from "@/lib/fonts";

interface PreviewCanvasProps {
  text: string;
  setText: (text: string) => void;
  animationConfig: AnimationConfig;
  setAnimationConfig: (config: AnimationConfig) => void;
  backgroundConfig: BackgroundConfig;
  setBackgroundConfig: (config: BackgroundConfig) => void;
  splitTextConfig: {
    enabled: boolean;
    type: "chars" | "words" | "lines";
    stagger: number;
    staggerFrom: "start" | "center" | "end" | "random" | "edges";
  };
  setSplitTextConfig: (config: {
    enabled: boolean;
    type: "chars" | "words" | "lines";
    stagger: number;
    staggerFrom: "start" | "center" | "end" | "random" | "edges";
  }) => void;
  onResetAll: () => void;
}

export interface PreviewCanvasRef {
  playAnimation: () => void;
  resetAnimation: () => void;
}

// Style mapping constants (moved outside component to avoid re-creation)
const fontSizeMap: Record<string, string> = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  "7xl": "4.5rem",
  "8xl": "6rem",
  "9xl": "8rem",
};

const fontWeightMap: Record<string, string> = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
};

const letterSpacingMap: Record<string, string> = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
};

const lineHeightMap: Record<string, string> = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
};

const PreviewCanvas = forwardRef<PreviewCanvasRef, PreviewCanvasProps>(({
  text,
  setText,
  animationConfig,
  backgroundConfig,
  splitTextConfig,
  onResetAll,
}, ref) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { resolvedTheme } = useTheme();

  const getSplitSelector = () => {
    return splitTextConfig.type === "chars" ? ".char" : ".word";
  };

  // All resettable style keys — used to clear stale inline styles
  const allStyleKeys = [
    "fontSize", "fontFamily", "fontWeight", "letterSpacing",
    "lineHeight", "textDecoration", "textTransform", "background", "color",
  ] as const;

  // Build computed styles from config (memoized)
  const computedStyles = useMemo(() => {
    const { customStyles } = animationConfig;
    const styles: React.CSSProperties = {};

    // Font size
    const fontSize = fontSizeMap[customStyles.fontSize] || customStyles.fontSize;
    if (fontSize) styles.fontSize = fontSize;

    // Font family
    let fontFamily = customStyles.fontFamily;
    if (fontFamily === "sans") fontFamily = "ui-sans-serif, system-ui, sans-serif";
    else if (fontFamily === "serif") fontFamily = "ui-serif, Georgia, serif";
    else if (fontFamily === "mono") fontFamily = "ui-monospace, monospace";
    else if (fontFamily && fontFamily !== "inherit") {
      // Check if it's a Google Font key
      const googleFont = googleFonts.find((f) => f.key === fontFamily);
      if (googleFont) {
        fontFamily = `var(--font-${googleFont.key})`;
      }
    }
    if (fontFamily && fontFamily !== "inherit") styles.fontFamily = fontFamily;

    // Font weight
    const fontWeight = fontWeightMap[customStyles.fontWeight] || customStyles.fontWeight;
    if (fontWeight) styles.fontWeight = fontWeight;

    // Letter spacing
    const letterSpacing = letterSpacingMap[customStyles.letterSpacing] || customStyles.letterSpacing;
    if (letterSpacing && letterSpacing !== "0em") styles.letterSpacing = letterSpacing;

    // Line height
    const lineHeight = lineHeightMap[customStyles.lineHeight] || customStyles.lineHeight;
    if (lineHeight && lineHeight !== "1.5") styles.lineHeight = lineHeight;

    // Text decoration
    if (customStyles.textDecoration && customStyles.textDecoration !== "none") {
      styles.textDecoration = customStyles.textDecoration;
    }

    // Text transform
    if (customStyles.textTransform && customStyles.textTransform !== "none") {
      styles.textTransform = customStyles.textTransform as React.CSSProperties["textTransform"];
    }

    // Background
    if (customStyles.background && customStyles.background !== "transparent") {
      styles.background = customStyles.background;
    }

    // Color — use theme-aware default
    if (customStyles.color && customStyles.color !== "inherit") {
      styles.color = customStyles.color;
    }

    return styles;
  }, [animationConfig.customStyles]);

  const splitTextIntoElements = (element: HTMLElement, type: string) => {
    const textContent = element.textContent || "";
    element.innerHTML = "";

    if (type === "chars") {
      textContent.split("").forEach((char) => {
        const span = document.createElement("span");
        span.className = "char";
        span.style.display = "inline-block";
        span.textContent = char === " " ? "\u00A0" : char;
        element.appendChild(span);
      });
    } else if (type === "words") {
      textContent.split(" ").forEach((word, index, arr) => {
        const span = document.createElement("span");
        span.className = "word";
        span.style.display = "inline-block";
        span.textContent = word;
        element.appendChild(span);
        if (index < arr.length - 1) {
          element.appendChild(document.createTextNode(" "));
        }
      });
    }
  };

  const resetAnimation = () => {
    if (!textRef.current) return;
    gsap.killTweensOf(textRef.current);
    gsap.killTweensOf(textRef.current.children);

    // Kill tweens on any existing split spans
    const existingSplits = textRef.current.querySelectorAll(".char, .word");
    if (existingSplits.length > 0) {
      gsap.killTweensOf(existingSplits);
    }

    // Clear GSAP transforms on the container
    gsap.set(textRef.current, {
      clearProps: "transform,opacity,filter,rotationX,rotationY,skewX",
    });
    gsap.set(textRef.current, {
      x: 0, y: 0, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, skewX: 0, opacity: 1, filter: "none",
    });

    // Re-apply custom styles on the container
    Object.assign(textRef.current.style, computedStyles);

    // Re-build the split DOM if split-text is enabled
    if (splitTextConfig.enabled) {
      textRef.current.textContent = text;
      splitTextIntoElements(textRef.current, splitTextConfig.type);
    }

    setIsAnimating(false);
  };

  const buildFilterString = (filterConfig: { type: string; value: number }) => {
    const { type, value } = filterConfig;
    if (value <= 0) return null;
    const unit = type === "blur" ? "px" : type === "saturate" ? "%" : "";
    return `${type}(${value}${unit})`;
  };

  const playAnimation = () => {
    if (!textRef.current || isAnimating) return;
    setIsAnimating(true);
    resetAnimation();

    let targets: HTMLElement | NodeListOf<Element> = textRef.current;

    if (splitTextConfig.enabled) {
      targets = textRef.current.querySelectorAll(getSplitSelector());
      if (targets.length === 0) {
        setIsAnimating(false);
        return;
      }
    }

    const animationProps: any = {
      duration: animationConfig.duration,
      delay: animationConfig.delay,
      ease: animationConfig.ease,
      repeat: animationConfig.repeat,
      yoyo: animationConfig.yoyo,
      onComplete: () => setIsAnimating(false),
    };

    if (splitTextConfig.enabled && splitTextConfig.stagger > 0) {
      if (splitTextConfig.staggerFrom && splitTextConfig.staggerFrom !== "start") {
        animationProps.stagger = {
          each: splitTextConfig.stagger,
          from: splitTextConfig.staggerFrom,
        };
      } else {
        animationProps.stagger = splitTextConfig.stagger;
      }
    }

    if (animationConfig.x !== 0) animationProps.x = animationConfig.x;
    if (animationConfig.y !== 0) animationProps.y = animationConfig.y;
    if (animationConfig.scale !== 1) animationProps.scale = animationConfig.scale;
    if (animationConfig.rotation !== 0) animationProps.rotation = animationConfig.rotation;
    if (animationConfig.rotationX !== 0) animationProps.rotationX = animationConfig.rotationX;
    if (animationConfig.rotationY !== 0) animationProps.rotationY = animationConfig.rotationY;
    if (animationConfig.skewX !== 0) animationProps.skewX = animationConfig.skewX;
    if (animationConfig.opacity !== 1) animationProps.opacity = animationConfig.opacity;

    const filterStr = buildFilterString(animationConfig.filter);
    if (filterStr) animationProps.filter = filterStr;

    if (animationConfig.tweenType === "fromTo" && animationConfig.fromValues) {
      const fromProps: any = {};
      const fv = animationConfig.fromValues;
      if (fv.x !== undefined && fv.x !== 0) fromProps.x = fv.x;
      if (fv.y !== undefined && fv.y !== 0) fromProps.y = fv.y;
      if (fv.scale !== undefined && fv.scale !== 1) fromProps.scale = fv.scale;
      if (fv.rotation !== undefined && fv.rotation !== 0) fromProps.rotation = fv.rotation;
      if (fv.rotationX !== undefined && fv.rotationX !== 0) fromProps.rotationX = fv.rotationX;
      if (fv.rotationY !== undefined && fv.rotationY !== 0) fromProps.rotationY = fv.rotationY;
      if (fv.skewX !== undefined && fv.skewX !== 0) fromProps.skewX = fv.skewX;
      if (fv.opacity !== undefined && fv.opacity !== 1) fromProps.opacity = fv.opacity;
      if (fv.filter) {
        const fromFilter = buildFilterString(fv.filter);
        if (fromFilter) fromProps.filter = fromFilter;
      }
      gsap.fromTo(targets, fromProps, animationProps);
    } else if (animationConfig.tweenType === "from") {
      gsap.from(targets, animationProps);
    } else {
      gsap.to(targets, animationProps);
    }
  };

  useImperativeHandle(ref, () => ({
    playAnimation,
    resetAnimation,
  }));

  // Apply text + split — use DOM manipulation only for split, React for normal
  useEffect(() => {
    if (!textRef.current) return;
    if (splitTextConfig.enabled) {
      // For split text, set text content first then split
      textRef.current.textContent = text;
      splitTextIntoElements(textRef.current, splitTextConfig.type);
    }
    // When split is not enabled, React handles the content via JSX
  }, [text, splitTextConfig]);

  // Apply inline styles to textRef whenever computedStyles change
  useEffect(() => {
    if (!textRef.current) return;
    // Clear all style keys first to remove stale values
    for (const key of allStyleKeys) {
      textRef.current.style[key as any] = "";
    }
    // Apply fresh computed styles
    Object.assign(textRef.current.style, computedStyles);
  }, [computedStyles]);

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
      style.backgroundImage = `url(${backgroundConfig.image})`;
      style.backgroundSize = "cover";
      style.backgroundPosition = "center";
      style.backgroundRepeat = "no-repeat";
    }

    return style;
  };

  const isAutoBackground = backgroundConfig.type === "solid" && backgroundConfig.color === "auto";

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className={`relative flex-1 flex items-center justify-center rounded-xl border transition-colors ${
          isAutoBackground
            ? "bg-[hsl(var(--canvas-bg))] border-[hsl(var(--canvas-border))] canvas-grid"
            : "border-border"
        } ${animationConfig.customStyles.containerOverflow ? "overflow-hidden" : "overflow-visible"}`}
        style={isAutoBackground ? {} : getBackgroundStyle()}
      >
        {/* Overflow wrapper — clips animated text when overflowHidden is on */}
        <div
          className="flex items-center justify-center"
          style={{
            overflow: animationConfig.customStyles.overflowHidden ? "hidden" : "visible",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            ref={textRef}
            className="text-center select-none"
            style={{
              willChange: "transform, opacity, filter",
              color: animationConfig.customStyles.color === "inherit"
                ? (isAutoBackground ? "hsl(var(--canvas-text))" : undefined)
                : animationConfig.customStyles.color,
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
