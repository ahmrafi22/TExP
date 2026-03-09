"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Code2 } from "lucide-react"
import CodeGenerator from "@/components/code-generator"
import type { AnimationConfig, BackgroundConfig } from "@/types/animation"

interface CodeDialogProps {
  text: string
  animationConfig: AnimationConfig
  backgroundConfig: BackgroundConfig
  splitTextConfig: {
    enabled: boolean
    type: "chars" | "words"
    stagger: number
  }
  framework: "vanilla" | "react" | "vue"
  language: "js" | "ts"
  onFrameworkChange: (framework: "vanilla" | "react" | "vue") => void
  onLanguageChange: (language: "js" | "ts") => void
}

export default function CodeDialog({
  text,
  animationConfig,
  backgroundConfig,
  splitTextConfig,
  framework,
  language,
  onFrameworkChange,
  onLanguageChange,
}: CodeDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Code2 className="h-3.5 w-3.5" />
          Get Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generated Code</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CodeGenerator
            text={text}
            animationConfig={animationConfig}
            backgroundConfig={backgroundConfig}
            splitTextConfig={splitTextConfig}
            framework={framework}
            language={language}
            onFrameworkChange={onFrameworkChange}
            onLanguageChange={onLanguageChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
