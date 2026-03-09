export interface AnimationConfig {
  x: number | string
  y: number | string
  scale: number
  rotation: number
  opacity: number
  duration: number
  delay: number
  ease: string
  tweenType: "from" | "to" | "fromTo"
  stagger: number
  repeat: number
  yoyo: boolean
  filter: {
    type: "blur" | "brightness" | "contrast" | "saturate"
    value: number
  }
  // FromTo specific properties
  fromValues?: {
    x?: number | string
    y?: number | string
    scale?: number
    rotation?: number
    opacity?: number
    filter?: {
      type: "blur" | "brightness" | "contrast" | "saturate"
      value: number
    }
  }
  customStyles: {
    fontSize: string
    fontFamily: string
    fontWeight: string
    letterSpacing: string
    background: string
    color: string
    textDecoration: string
    textTransform: string
    lineHeight: string
    overflowHidden: boolean
    containerOverflow: boolean
  }
}

export interface BackgroundConfig {
  type: "solid" | "gradient" | "image"
  color: string
  gradient: {
    type: "linear" | "radial"
    colors: string[]
    direction: string
  }
  image: string | null
}

export interface SplitTextConfig {
  enabled: boolean
  type: "chars" | "words" | "lines"
  stagger: number
}

export interface CodeGenerationParams {
  text: string
  animationConfig: AnimationConfig
  backgroundConfig: BackgroundConfig
  splitTextConfig: SplitTextConfig
  framework: "vanilla" | "react" | "vue"
  language: "js" | "ts"
}
