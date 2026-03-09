import type { CodeGenerationParams } from "@/types/animation"

export function generateCode(params: CodeGenerationParams) {
  const { text, animationConfig, backgroundConfig, splitTextConfig, framework, language } = params

  const animationCode = generateAnimationCode(params)
  const completeCode = generateCompleteCode(params)

  return {
    animation: animationCode,
    complete: completeCode,
  }
}

function generateAnimationCode(params: CodeGenerationParams) {
  const { animationConfig, splitTextConfig, framework, language } = params
  const isTS = language === "ts"

  let code = ""

  // Add imports and setup comments
  if (framework === "vanilla") {
    code += `// Import GSAP\n`
    code += `import { gsap } from "gsap";\n`
    if (splitTextConfig.enabled) {
      code += `import { SplitText } from "gsap/SplitText";\n`
    }
    code += `\n// Target element reference\n`
    code += `const textElement = document.querySelector('.animated-text');\n\n`
  } else if (framework === "react") {
    code += `// Import GSAP and useGSAP hook\n`
    code += `import { gsap } from "gsap";\n`
    code += `import { useGSAP } from "@gsap/react";\n`
    if (splitTextConfig.enabled) {
      code += `import { SplitText } from "gsap/SplitText";\n`
    }
    code += `import { useRef } from "react";\n\n`
    code += `// Component ref\n`
    code += `const textRef = useRef${isTS ? "<HTMLDivElement>(null)" : "(null)"};\n\n`
  } else if (framework === "vue") {
    code += `// Import GSAP\n`
    code += `import { gsap } from "gsap";\n`
    if (splitTextConfig.enabled) {
      code += `import { SplitText } from "gsap/SplitText";\n`
    }
    code += `import { onMounted, ref } from "vue";\n\n`
    code += `// Template ref\n`
    code += `const textRef = ref${isTS ? "<HTMLElement | null>" : ""}(null);\n\n`
  }

  // Generate animation logic
  const animationLogic = generateAnimationLogic(params)

  if (framework === "vanilla") {
    code += animationLogic
  } else if (framework === "react") {
    code += `useGSAP(() => {\n`
    code += `  ${animationLogic.split("\n").join("\n  ")}\n`
    code += `}, []);\n`
  } else if (framework === "vue") {
    code += `onMounted(() => {\n`
    code += `  ${animationLogic.split("\n").join("\n  ")}\n`
    code += `});\n`
  }

  return code
}

function generateAnimationLogic(params: CodeGenerationParams) {
  const { animationConfig, splitTextConfig, framework } = params

  let elementRef = ""
  if (framework === "vanilla") {
    elementRef = "textElement"
  } else if (framework === "react") {
    elementRef = "textRef.current"
  } else if (framework === "vue") {
    elementRef = "textRef.value"
  }

  let code = `if (!${elementRef}) return;\n\n`

  // SplitText setup
  if (splitTextConfig.enabled) {
    code += `// Initialize SplitText\n`
    code += `const split = new SplitText(${elementRef}, { type: "${splitTextConfig.type}" });\n`
    code += `const elements = split.${splitTextConfig.type};\n\n`
  }

  // Animation properties
  const animProps = []

  const formatValue = (value: number | string) => {
    if (typeof value === "string") {
      return `"${value}"` // Add quotes for string values (like percentages)
    }
    return value.toString() // No quotes for numbers
  }

  // Include values that are not at their defaults
  const xValue = animationConfig.x
  const yValue = animationConfig.y

  if (xValue !== 0 && xValue !== "0%" && xValue !== "") {
    animProps.push(`x: ${formatValue(xValue)}`)
  }
  if (yValue !== 0 && yValue !== "0%" && yValue !== "") {
    animProps.push(`y: ${formatValue(yValue)}`)
  }
  if (animationConfig.scale !== 1) animProps.push(`scale: ${animationConfig.scale}`)
  if (animationConfig.rotation !== 0) animProps.push(`rotation: ${animationConfig.rotation}`)
  if (animationConfig.rotationX !== 0) animProps.push(`rotationX: ${animationConfig.rotationX}`)
  if (animationConfig.rotationY !== 0) animProps.push(`rotationY: ${animationConfig.rotationY}`)
  if (animationConfig.skewX !== 0) animProps.push(`skewX: ${animationConfig.skewX}`)
  if (animationConfig.opacity !== 1) animProps.push(`opacity: ${animationConfig.opacity}`)

  // Add filter if it has a value
  if (animationConfig.filter && animationConfig.filter.value !== 0) {
    const { type, value } = animationConfig.filter
    let filterValue = ""
    switch (type) {
      case "blur":
        filterValue = `"blur(${value}px)"`
        break
      case "brightness":
        filterValue = `"brightness(${value}%)"`
        break
      case "contrast":
        filterValue = `"contrast(${value}%)"`
        break
      case "saturate":
        filterValue = `"saturate(${value}%)"`
        break
    }
    animProps.push(`filter: ${filterValue}`)
  }

  animProps.push(`duration: ${animationConfig.duration}`)
  if (animationConfig.delay > 0) animProps.push(`delay: ${animationConfig.delay}`)
  if (animationConfig.ease !== "power1.out") animProps.push(`ease: "${animationConfig.ease}"`)

  // Add repeat and yoyo
  if (animationConfig.repeat > 0) {
    animProps.push(`repeat: ${animationConfig.repeat}`)
  }
  if (animationConfig.yoyo && animationConfig.repeat > 0) {
    animProps.push(`yoyo: true`)
  }

  // Stagger for SplitText only
  if (splitTextConfig.enabled && splitTextConfig.stagger > 0) {
    if (splitTextConfig.staggerFrom && splitTextConfig.staggerFrom !== "start") {
      animProps.push(`stagger: { each: ${splitTextConfig.stagger}, from: "${splitTextConfig.staggerFrom}" }`)
    } else {
      animProps.push(`stagger: ${splitTextConfig.stagger}`)
    }
  }

  const target = splitTextConfig.enabled ? "elements" : elementRef
  const propsString = animProps.join(",\n  ")

  // Generate animation call
  code += `// Create animation\n`
  if (animationConfig.tweenType === "to") {
    code += `gsap.to(${target}, {\n  ${propsString}\n});\n`
  } else if (animationConfig.tweenType === "from") {
    code += `gsap.from(${target}, {\n  ${propsString}\n});\n`
  } else if (animationConfig.tweenType === "fromTo") {
    // Generate FROM properties
    const fromProps = []
    const fromValues = animationConfig.fromValues

    const fromXValue = fromValues?.x ?? 0
    const fromYValue = fromValues?.y ?? 0

    if (fromXValue !== 0 && fromXValue !== "0%" && fromXValue !== "") {
      fromProps.push(`x: ${formatValue(fromXValue)}`)
    }
    if (fromYValue !== 0 && fromYValue !== "0%" && fromYValue !== "") {
      fromProps.push(`y: ${formatValue(fromYValue)}`)
    }
    if ((fromValues?.scale ?? 1) !== 1) fromProps.push(`scale: ${fromValues?.scale ?? 1}`)
    if ((fromValues?.rotation ?? 0) !== 0) fromProps.push(`rotation: ${fromValues?.rotation ?? 0}`)
    if ((fromValues?.rotationX ?? 0) !== 0) fromProps.push(`rotationX: ${fromValues?.rotationX ?? 0}`)
    if ((fromValues?.rotationY ?? 0) !== 0) fromProps.push(`rotationY: ${fromValues?.rotationY ?? 0}`)
    if ((fromValues?.skewX ?? 0) !== 0) fromProps.push(`skewX: ${fromValues?.skewX ?? 0}`)
    if ((fromValues?.opacity ?? 1) !== 1) fromProps.push(`opacity: ${fromValues?.opacity ?? 1}`)

    // Add from filter if it has a value
    if (fromValues?.filter && fromValues.filter.value !== 0) {
      const { type, value } = fromValues.filter
      let filterValue = ""
      switch (type) {
        case "blur":
          filterValue = `"blur(${value}px)"`
          break
        case "brightness":
          filterValue = `"brightness(${value}%)"`
          break
        case "contrast":
          filterValue = `"contrast(${value}%)"`
          break
        case "saturate":
          filterValue = `"saturate(${value}%)"`
          break
      }
      fromProps.push(`filter: ${filterValue}`)
    }

    // Generate TO properties (use the regular animation properties)
    const toProps = []
    if (xValue !== 0 && xValue !== "0%" && xValue !== "") {
      toProps.push(`x: ${formatValue(xValue)}`)
    }
    if (yValue !== 0 && yValue !== "0%" && yValue !== "") {
      toProps.push(`y: ${formatValue(yValue)}`)
    }
    if (animationConfig.scale !== 1) toProps.push(`scale: ${animationConfig.scale}`)
    if (animationConfig.rotation !== 0) toProps.push(`rotation: ${animationConfig.rotation}`)
    if (animationConfig.rotationX !== 0) toProps.push(`rotationX: ${animationConfig.rotationX}`)
    if (animationConfig.rotationY !== 0) toProps.push(`rotationY: ${animationConfig.rotationY}`)
    if (animationConfig.skewX !== 0) toProps.push(`skewX: ${animationConfig.skewX}`)
    if (animationConfig.opacity !== 1) toProps.push(`opacity: ${animationConfig.opacity}`)

    // Add to filter if it has a value
    if (animationConfig.filter && animationConfig.filter.value !== 0) {
      const { type, value } = animationConfig.filter
      let filterValue = ""
      switch (type) {
        case "blur":
          filterValue = `"blur(${value}px)"`
          break
        case "brightness":
          filterValue = `"brightness(${value}%)"`
          break
        case "contrast":
          filterValue = `"contrast(${value}%)"`
          break
        case "saturate":
          filterValue = `"saturate(${value}%)"`
          break
      }
      toProps.push(`filter: ${filterValue}`)
    }

    const timingProps = animProps.filter(
      (prop) =>
        prop.includes("duration:") ||
        prop.includes("delay:") ||
        prop.includes("ease:") ||
        prop.includes("repeat:") ||
        prop.includes("yoyo:") ||
        prop.includes("stagger:"),
    )

    const fromPropsString = fromProps.length > 0 ? fromProps.join(",\n  ") : ""
    const toPropsString = [...toProps, ...timingProps].join(",\n  ")

    code += `gsap.fromTo(${target}, {\n  ${fromPropsString}\n}, {\n  ${toPropsString}\n});\n`
  }

  return code
}

function generateCompleteCode(params: CodeGenerationParams) {
  const { framework, language, animationConfig } = params
  const isTS = language === "ts"
  const animationCode = generateAnimationCode(params)

  // Generate CSS styles from custom config
  const generateCustomStyles = () => {
    const { customStyles } = animationConfig;
    
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

    const styles: Record<string, string> = {};
    
    // Only include non-default values
    const fontSize = fontSizeMap[customStyles.fontSize] || customStyles.fontSize;
    if (fontSize !== "2.25rem") { // 4xl default
      styles.fontSize = fontSize;
    }
    
    let fontFamily = customStyles.fontFamily;
    if (fontFamily === "sans") fontFamily = "ui-sans-serif, system-ui, sans-serif";
    else if (fontFamily === "serif") fontFamily = "ui-serif, Georgia, serif";  
    else if (fontFamily === "mono") fontFamily = "ui-monospace, monospace";
    else if (fontFamily !== "inherit") {
      // Google Font key — output the actual font name for generated code
      const googleFontNames: Record<string, string> = {
        inter: "'Inter'", roboto: "'Roboto'", openSans: "'Open Sans'", lato: "'Lato'",
        montserrat: "'Montserrat'", poppins: "'Poppins'", nunito: "'Nunito'", raleway: "'Raleway'",
        workSans: "'Work Sans'", dmSans: "'DM Sans'", outfit: "'Outfit'",
        plusJakartaSans: "'Plus Jakarta Sans'", spaceGrotesk: "'Space Grotesk'",
        urbanist: "'Urbanist'", quicksand: "'Quicksand'", rubik: "'Rubik'",
        karla: "'Karla'", manrope: "'Manrope'", lexend: "'Lexend'", cabin: "'Cabin'",
        mulish: "'Mulish'", nunitoSans: "'Nunito Sans'", josefinSans: "'Josefin Sans'",
        titilliumWeb: "'Titillium Web'", exo2: "'Exo 2'", figtree: "'Figtree'",
        sora: "'Sora'", archivo: "'Archivo'",
        playfairDisplay: "'Playfair Display'", merriweather: "'Merriweather'", lora: "'Lora'",
        crimsonText: "'Crimson Text'", ebGaramond: "'EB Garamond'",
        libreBaskerville: "'Libre Baskerville'", cormorantGaramond: "'Cormorant Garamond'",
        bitter: "'Bitter'", sourceSerif4: "'Source Serif 4'", dmSerif: "'DM Serif Display'",
        notoSerif: "'Noto Serif'", vollkorn: "'Vollkorn'", spectral: "'Spectral'",
        jetbrainsMono: "'JetBrains Mono'", firaCode: "'Fira Code'",
        sourceCodePro: "'Source Code Pro'", spaceMono: "'Space Mono'",
        ibmPlexMono: "'IBM Plex Mono'", robotoMono: "'Roboto Mono'",
        inconsolata: "'Inconsolata'",
        oswald: "'Oswald'", bebasNeue: "'Bebas Neue'", anton: "'Anton'",
        righteous: "'Righteous'", comfortaa: "'Comfortaa'", fredoka: "'Fredoka'",
        abrilFatface: "'Abril Fatface'", alfaSlabOne: "'Alfa Slab One'",
        permanentMarker: "'Permanent Marker'", pressStart2P: "'Press Start 2P'",
        bungee: "'Bungee'", bungeeShade: "'Bungee Shade'", silkscreen: "'Silkscreen'",
        blackOpsOne: "'Black Ops One'",
        pacifico: "'Pacifico'", dancingScript: "'Dancing Script'", caveat: "'Caveat'",
        satisfy: "'Satisfy'", greatVibes: "'Great Vibes'", lobster: "'Lobster'",
        sacramento: "'Sacramento'", indieFlower: "'Indie Flower'", kalam: "'Kalam'",
      };
      fontFamily = googleFontNames[fontFamily] || fontFamily;
    }
    if (fontFamily !== "inherit") {
      styles.fontFamily = fontFamily;
    }
    
    const fontWeight = fontWeightMap[customStyles.fontWeight] || customStyles.fontWeight;
    if (fontWeight !== "700") { // bold default
      styles.fontWeight = fontWeight;
    }
    
    const letterSpacing = letterSpacingMap[customStyles.letterSpacing] || customStyles.letterSpacing;
    if (letterSpacing !== "0em") {
      styles.letterSpacing = letterSpacing;
    }
    
    const lineHeight = lineHeightMap[customStyles.lineHeight] || customStyles.lineHeight;
    if (lineHeight !== "1.5") {
      styles.lineHeight = lineHeight;
    }
    
    if (customStyles.background !== "transparent") {
      styles.background = customStyles.background;
    }
    
    if (customStyles.color !== "inherit") {
      styles.color = customStyles.color;
    }
    
    if (customStyles.textDecoration !== "none") {
      styles.textDecoration = customStyles.textDecoration;
    }
    
    if (customStyles.textTransform !== "none") {
      styles.textTransform = customStyles.textTransform;
    }
    
    if (customStyles.overflowHidden) {
      styles.overflow = "hidden";
    }
    
    // Note: containerOverflow is handled separately as it applies to the container, not text
    
    return styles;
  };

  const customStyles = generateCustomStyles();

  if (framework === "vanilla") {
    let cssCode = "";
    let containerStyles = "";
    
    if (animationConfig.customStyles.containerOverflow) {
      containerStyles = `
.text-container {
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
`;
    }
    
    if (Object.keys(customStyles).length > 0) {
      cssCode = `
// CSS (Custom Styles):
/*${containerStyles}
.animated-text {
  text-align: center;
${Object.entries(customStyles).map(([key, value]) => `  ${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`).join('\n')}
}
*/`;
    } else {
      cssCode = `
// CSS (optional):
/*${containerStyles}
.animated-text {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}
*/`;
    }

    const htmlStructure = animationConfig.customStyles.containerOverflow 
      ? "// <div class=\"text-container\"><div class=\"animated-text\">Your Text Here</div></div>"
      : "// <div class=\"animated-text\">Your Text Here</div>";

    return `${animationCode}

// HTML Structure:
${htmlStructure}
${cssCode}`;
  } else if (framework === "react") {
    const styleObject = Object.keys(customStyles).length > 0 ? 
      `{
        textAlign: 'center',
${Object.entries(customStyles).map(([key, value]) => `        ${key}: '${value}'`).join(',\n')}
      }` :
      `{
        fontSize: '2rem',
        fontWeight: 'bold',
        textAlign: 'center'
      }`;

    const containerStyle = animationConfig.customStyles.containerOverflow ? 
      `{
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }` : null;

    const containerJSX = containerStyle ? `
    <div className="text-container" style={${containerStyle}}>
      <div 
        ref={textRef}
        className="animated-text"
        style={${styleObject}}
      >
        ${params.text}
      </div>
    </div>` : `
    <div 
      ref={textRef}
      className="animated-text"
      style={${styleObject}}
    >
      ${params.text}
    </div>`;

    return `import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
${params.splitTextConfig.enabled ? "import { SplitText } from 'gsap/SplitText';" : ""}

${isTS ? "const AnimatedText: React.FC = () => {" : "const AnimatedText = () => {"}
  const textRef = useRef${isTS ? "<HTMLDivElement>(null)" : "(null)"};

  ${animationCode.split("\n").slice(6).join("\n  ")}

  return (${containerJSX}
  );
};

export default AnimatedText;`;
  } else if (framework === "vue") {
    const styleObject = Object.keys(customStyles).length > 0 ? 
      `{
      textAlign: 'center',
${Object.entries(customStyles).map(([key, value]) => `      ${key}: '${value}'`).join(',\n')}
    }` :
      `{
      fontSize: '2rem',
      fontWeight: 'bold',
      textAlign: 'center'
    }`;

    const containerStyle = animationConfig.customStyles.containerOverflow ? 
      `{
      overflow: 'hidden',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }` : null;

    const template = containerStyle ? `
  <div class="text-container" :style="${containerStyle}">
    <div 
      ref="textRef"
      class="animated-text"
      :style="${styleObject}"
    >
      ${params.text}
    </div>
  </div>` : `
  <div 
    ref="textRef"
    class="animated-text"
    :style="${styleObject}"
  >
    ${params.text}
  </div>`;

    return `<template>${template}
</template>

<script${isTS ? ' lang="ts"' : ""}>
import { defineComponent, onMounted, ref } from 'vue';
import { gsap } from 'gsap';
${params.splitTextConfig.enabled ? "import { SplitText } from 'gsap/SplitText';" : ""}

export default defineComponent({
  name: 'AnimatedText',
  setup() {
    const textRef = ref${isTS ? "<HTMLElement | null>" : ""}(null);

    ${animationCode.split("\n").slice(6).join("\n    ")}

    return {
      textRef
    };
  }
});
</script>`;
  }

  return animationCode;
}
