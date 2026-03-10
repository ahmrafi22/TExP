"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Code2, FileCode } from "lucide-react"
import { SiReact, SiVuedotjs, SiJavascript, SiTypescript } from "react-icons/si"
import { TbBrandJavascript } from "react-icons/tb"
import { generateCode } from "@/utils/code-generator"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { useShallow } from "zustand/react/shallow"

const frameworkOptions = [
  { value: "vanilla" as const, label: "Vanilla", icon: TbBrandJavascript, color: "text-yellow-500" },
  { value: "react" as const, label: "React", icon: SiReact, color: "text-cyan-400" },
  { value: "vue" as const, label: "Vue", icon: SiVuedotjs, color: "text-emerald-500" },
]

const languageOptions = [
  { value: "js" as const, label: "JS", icon: SiJavascript, color: "text-yellow-400" },
  { value: "ts" as const, label: "TS", icon: SiTypescript, color: "text-blue-500" },
]

export default function CodeGenerator() {
  const {
    text,
    animationConfig,
    backgroundConfig,
    splitTextConfig,
    framework,
    language,
    onFrameworkChange,
    onLanguageChange,
  } = usePlaygroundStore(
    useShallow((s) => ({
      text: s.text,
      animationConfig: s.animationConfig,
      backgroundConfig: s.backgroundConfig,
      splitTextConfig: s.splitTextConfig,
      framework: s.selectedFramework,
      language: s.selectedLanguage,
      onFrameworkChange: s.setSelectedFramework,
      onLanguageChange: s.setSelectedLanguage,
    })),
  )

  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const generatedCode = generateCode({
    text,
    animationConfig,
    backgroundConfig,
    splitTextConfig,
    framework,
    language,
  })

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(type)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const activeFramework = frameworkOptions.find(f => f.value === framework)!
  const activeLanguage = languageOptions.find(l => l.value === language)!

  const fileExtension = framework === "vue"
    ? ".vue"
    : language === "ts"
      ? (framework === "react" ? ".tsx" : ".ts")
      : (framework === "react" ? ".jsx" : ".js")

  return (
    <div className="space-y-5">
      {/* Framework & Language selectors */}
      <div className="flex items-center gap-4">
        {/* Framework pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted/50">
          {frameworkOptions.map((fw) => {
            const Icon = fw.icon
            const isActive = framework === fw.value
            return (
              <button
                key={fw.value}
                onClick={() => onFrameworkChange(fw.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? fw.color : ""}`} />
                {fw.label}
              </button>
            )
          })}
        </div>

        {/* Language pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted/50">
          {languageOptions.map((lang) => {
            const Icon = lang.icon
            const isActive = language === lang.value
            return (
              <button
                key={lang.value}
                onClick={() => onLanguageChange(lang.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? lang.color : ""}`} />
                {lang.label}
              </button>
            )
          })}
        </div>

        {/* File badge */}
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileCode className="h-3.5 w-3.5" />
          <span className="font-mono">{activeFramework.label.toLowerCase()}{fileExtension}</span>
        </div>
      </div>

      {/* Code tabs */}
      <Tabs defaultValue="animation" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-9">
          <TabsTrigger value="animation" className="text-xs gap-1.5">
            <Code2 className="h-3.5 w-3.5" />
            Animation Only
          </TabsTrigger>
          <TabsTrigger value="complete" className="text-xs gap-1.5">
            <FileCode className="h-3.5 w-3.5" />
            Complete Component
          </TabsTrigger>
        </TabsList>

        <TabsContent value="animation" className="mt-3">
          <div className="relative group rounded-lg overflow-hidden border border-border">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <activeFramework.icon className={`h-3.5 w-3.5 ${activeFramework.color}`} />
                <span>Animation Code</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs gap-1.5"
                onClick={() => copyToClipboard(generatedCode.animation, "animation")}
              >
                {copiedCode === "animation" ? (
                  <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> Copy</>
                )}
              </Button>
            </div>
            <pre className="bg-zinc-950 text-zinc-100 p-4 text-sm overflow-auto max-h-[350px] min-h-[200px] custom-scrollbar">
              <code>{generatedCode.animation}</code>
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="complete" className="mt-3">
          <div className="relative group rounded-lg overflow-hidden border border-border">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <activeFramework.icon className={`h-3.5 w-3.5 ${activeFramework.color}`} />
                <span>Complete Component</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs gap-1.5"
                onClick={() => copyToClipboard(generatedCode.complete, "complete")}
              >
                {copiedCode === "complete" ? (
                  <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> Copy</>
                )}
              </Button>
            </div>
            <pre className="bg-zinc-950 text-zinc-100 p-4 text-sm overflow-auto max-h-[350px] min-h-[200px] custom-scrollbar">
              <code>{generatedCode.complete}</code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
