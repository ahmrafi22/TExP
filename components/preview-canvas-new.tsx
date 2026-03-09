"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Play, RotateCcw } from "lucide-react";
import type { AnimationConfig, BackgroundConfig } from "@/types/animation";
import TextInput from "@/components/text-input";

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
  };
  setSplitTextConfig: (config: {
    enabled: boolean;
    type: "chars" | "words" | "lines";
    stagger: number;
  }) => void;
  onResetAll: () => void;
}

export default function PreviewCanvas({
  text,
  setText,
  animationConfig,
  backgroundConfig,
  splitTextConfig,
  onResetAll,
}: PreviewCanvasProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const getSplitSelector = () => {
    switch (splitTextConfig.type) {
      case "chars":
        return ".char";
      case "words":
        return ".word";
      case "lines":
        return ".line";
      default:
        return "";
    }
  };

  const splitText = (element: HTMLElement, type: string) => {
    const text = element.textContent || "";
    element.innerHTML = "";

    if (type === "chars") {
      const chars = text.split("");
      chars.forEach((char) => {
        const span = document.createElement("span");
        span.className = "char";
        span.style.display = "inline-block";
        span.textContent = char === " " ? "\u00A0" : char;
        element.appendChild(span);
      });
    } else if (type === "words") {
      const words = text.split(" ");
      words.forEach((word, index) => {
        const span = document.createElement("span");
        span.className = "word";
        span.style.display = "inline-block";
        span.textContent = word;
        element.appendChild(span);
        if (index < words.length - 1) {
          element.appendChild(document.createTextNode(" "));
        }
      });
    } else if (type === "lines") {
      const lines = text.split("\n");
      lines.forEach((line, index) => {
        const span = document.createElement("span");
        span.className = "line";
        span.style.display = "block";
        span.textContent = line;
        element.appendChild(span);
        if (index < lines.length - 1) {
          element.appendChild(document.createElement("br"));
        }
      });
    }
  };

  const resetAnimation = () => {
    if (!textRef.current) return;

    gsap.killTweensOf(textRef.current);
    gsap.killTweensOf(textRef.current.children);

    if (splitTextConfig.enabled) {
      const targets = textRef.current.querySelectorAll(getSplitSelector());
      gsap.set(targets, { clearProps: "all" });
    } else {
      gsap.set(textRef.current, { clearProps: "all" });
    }

    gsap.set(textRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      opacity: 1,
      filter: "none",
    });

    if (splitTextConfig.enabled) {
      const targets = textRef.current.querySelectorAll(getSplitSelector());
      gsap.set(targets, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
        filter: "none",
      });
    }

    setIsAnimating(false);
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
      animationProps.stagger = splitTextConfig.stagger;
    }

    if (animationConfig.x !== 0) animationProps.x = animationConfig.x;
    if (animationConfig.y !== 0) animationProps.y = animationConfig.y;
    if (animationConfig.scale !== 1) animationProps.scale = animationConfig.scale;
    if (animationConfig.rotation !== 0) animationProps.rotation = animationConfig.rotation;
    if (animationConfig.opacity !== 1) animationProps.opacity = animationConfig.opacity;

    if (animationConfig.filter.value > 0) {
      const filterType = animationConfig.filter.type;
      const filterValue = animationConfig.filter.value;
      let unit = "";
      
      if (filterType === "blur") unit = "px";
      else if (filterType === "brightness" || filterType === "contrast") unit = "";
      else if (filterType === "saturate") unit = "%";
      
      animationProps.filter = `${filterType}(${filterValue}${unit})`;
    }

    if (animationConfig.tweenType === "fromTo" && animationConfig.fromValues) {
      const fromProps: any = {};
      const fromValues = animationConfig.fromValues;

      if (fromValues.x !== undefined && fromValues.x !== 0) fromProps.x = fromValues.x;
      if (fromValues.y !== undefined && fromValues.y !== 0) fromProps.y = fromValues.y;
      if (fromValues.scale !== undefined && fromValues.scale !== 1) fromProps.scale = fromValues.scale;
      if (fromValues.rotation !== undefined && fromValues.rotation !== 0) fromProps.rotation = fromValues.rotation;
      if (fromValues.opacity !== undefined && fromValues.opacity !== 1) fromProps.opacity = fromValues.opacity;

      if (fromValues.filter && fromValues.filter.value > 0) {
        const filterType = fromValues.filter.type;
        const filterValue = fromValues.filter.value;
        let unit = "";
        
        if (filterType === "blur") unit = "px";
        else if (filterType === "brightness" || filterType === "contrast") unit = "";
        else if (filterType === "saturate") unit = "%";
        
        fromProps.filter = `${filterType}(${filterValue}${unit})`;
      }

      gsap.fromTo(targets, fromProps, animationProps);
    } else if (animationConfig.tweenType === "from") {
      gsap.from(targets, animationProps);
    } else {
      gsap.to(targets, animationProps);
    }
  };

  const renderText = () => {
    const { customStyles } = animationConfig;
    
    // Debug: Log the current custom styles
    console.log("Custom styles:", customStyles);
    
    // Map Tailwind values to CSS values
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

    // Build inline styles object with proper CSS values
    const inlineStyles: React.CSSProperties = {};
    
    // Font size - always apply if different from default
    const fontSize = fontSizeMap[customStyles.fontSize] || customStyles.fontSize;
    if (fontSize) {
      inlineStyles.fontSize = fontSize;
      console.log("Applied fontSize:", fontSize);
    }
    
    // Font family - always apply if not inherit
    let fontFamily = customStyles.fontFamily;
    if (fontFamily === "sans") fontFamily = "ui-sans-serif, system-ui, sans-serif";
    else if (fontFamily === "serif") fontFamily = "ui-serif, Georgia, serif";
    else if (fontFamily === "mono") fontFamily = "ui-monospace, monospace";
    if (fontFamily && fontFamily !== "inherit") {
      inlineStyles.fontFamily = fontFamily;
      console.log("Applied fontFamily:", fontFamily);
    }
    
    // Font weight - always apply if different from default
    const fontWeight = fontWeightMap[customStyles.fontWeight] || customStyles.fontWeight;
    if (fontWeight) {
      inlineStyles.fontWeight = fontWeight;
      console.log("Applied fontWeight:", fontWeight);
    }
    
    // Letter spacing
    const letterSpacing = letterSpacingMap[customStyles.letterSpacing] || customStyles.letterSpacing;
    if (letterSpacing && letterSpacing !== "0em") {
      inlineStyles.letterSpacing = letterSpacing;
    }
    
    // Line height
    const lineHeight = lineHeightMap[customStyles.lineHeight] || customStyles.lineHeight;
    if (lineHeight && lineHeight !== "1.5") {
      inlineStyles.lineHeight = lineHeight;
    }
    
    // Text decoration
    if (customStyles.textDecoration && customStyles.textDecoration !== "none") {
      inlineStyles.textDecoration = customStyles.textDecoration;
    }
    
    // Text transform
    if (customStyles.textTransform && customStyles.textTransform !== "none") {
      inlineStyles.textTransform = customStyles.textTransform as React.CSSProperties['textTransform'];
    }
    
    // Background
    if (customStyles.background && customStyles.background !== "transparent") {
      inlineStyles.background = customStyles.background;
    }
    
    // Color
    if (customStyles.color && customStyles.color !== "inherit") {
      inlineStyles.color = customStyles.color;
    }
    
    // Overflow (this affects the container, but we'll handle it inline for the text element)
    if (customStyles.overflowHidden) {
      inlineStyles.overflow = "hidden";
    }

    console.log("Final inline styles:", inlineStyles);

    // Use minimal classes, rely on inline styles for custom values
    const baseClasses = "text-center select-none";

    return (
      <span className={baseClasses} style={inlineStyles}>
        {text}
      </span>
    );
  };

  useEffect(() => {
    if (!textRef.current) return;

    if (splitTextConfig.enabled) {
      splitText(textRef.current, splitTextConfig.type);
    } else {
      textRef.current.innerHTML = "";
      textRef.current.appendChild(document.createTextNode(text));
    }
  }, [text, splitTextConfig, animationConfig.customStyles]);

  const getBackgroundStyle = () => {
    const style: React.CSSProperties = {};

    if (backgroundConfig.type === "solid") {
      style.backgroundColor = backgroundConfig.color;
    } else if (backgroundConfig.type === "gradient") {
      const { type, colors, direction } = backgroundConfig.gradient;
      const gradient = type === "radial"
        ? `radial-gradient(circle, ${colors.join(", ")})`
        : `linear-gradient(${direction}, ${colors.join(", ")})`;
      style.background = gradient;
    } else if (backgroundConfig.type === "image" && backgroundConfig.image) {
      style.backgroundImage = `url(${backgroundConfig.image})`;
      style.backgroundSize = "cover";
      style.backgroundPosition = "center";
      style.backgroundRepeat = "no-repeat";
    }

    return style;
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="p-6 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={playAnimation} 
              disabled={isAnimating}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-full font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Play className="h-4 w-4" />
              {isAnimating ? "Playing..." : "Play Animation"}
            </button>
            <button 
              onClick={resetAnimation}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-full font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button 
              onClick={onResetAll}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              Reset All
            </button>
          </div>
        </div>

        <div 
          className={`relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl shadow-inner ${
            animationConfig.customStyles.containerOverflow ? "overflow-hidden" : "overflow-visible"
          }`}
          style={getBackgroundStyle()}
        >
          <div
            ref={textRef}
            className="text-center select-none"
            style={{
              willChange: "transform, opacity, filter",
            }}
          >
            {renderText()}
          </div>
        </div>

        <div className="mt-6">
          <TextInput text={text} onChange={setText} />
        </div>
      </div>
    </div>
  );
}
