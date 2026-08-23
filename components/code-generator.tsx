"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code2, FileCode } from "lucide-react"
import { SiReact, SiVuedotjs, SiJavascript, SiTypescript } from "react-icons/si"
import { TbBrandJavascript } from "react-icons/tb"
import { generateCode } from "@/utils/code-generator"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { useShallow } from "zustand/react/shallow"
import CodeBlock from "@/components/code-block"

const frameworkOptions = [
  { value: "vanilla" as const, label: "Vanilla", icon: TbBrandJavascript, color: "text-yellow-500" },
  { value: "react" as const, label: "React", icon: SiReact, color: "text-cyan-400" },
  { value: "vue" as const, label: "Vue", icon: SiVuedotjs, color: "text-emerald-500" },
]

const languageOptions = [
  { value: "js" as const, label: "JS", icon: SiJavascript, color: "text-yellow-400" },
  { value: "ts" as const, label: "TS", icon: SiTypescript, color: "text-blue-500" },
]

export type ExportFramework = "vanilla" | "react" | "vue"
export type ExportLanguage = "js" | "ts"

interface CodeSource {
  framework: ExportFramework
  language: ExportLanguage
  onFrameworkChange: (fw: ExportFramework) => void
  onLanguageChange: (lang: ExportLanguage) => void
  generate: (framework: ExportFramework, language: ExportLanguage) => { animation: string; complete: string }
  tabs?: { value: string; label: string }[]
}

interface CodeGeneratorProps {
  /** External source — when omitted, reads/writes the playground store (default). */
  source?: CodeSource
  /** Extra tabs appended after "Animation Only" / "Complete Component". */
  extraTabs?: { value: string; label: string; render: () => React.ReactNode }[]
}

export default function CodeGenerator({ source, extraTabs }: CodeGeneratorProps = {}) {
  const store = usePlaygroundStore(
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

  // External binding or store fallback
  const framework = source?.framework ?? store.framework
  const language = source?.language ?? store.language
  const onFrameworkChange = source?.onFrameworkChange ?? store.onFrameworkChange
  const onLanguageChange = source?.onLanguageChange ?? store.onLanguageChange

  const generated = source
    ? source.generate(framework, language)
    : generateCode({
        text: store.text,
        animationConfig: store.animationConfig,
        backgroundConfig: store.backgroundConfig,
        splitTextConfig: store.splitTextConfig,
        framework,
        language,
      })

  const activeFramework = frameworkOptions.find((f) => f.value === framework)!
  const activeLanguage = languageOptions.find((l) => l.value === language)!

  const fileExtension = framework === "vue"
    ? ".vue"
    : language === "ts"
      ? (framework === "react" ? ".tsx" : ".ts")
      : (framework === "react" ? ".jsx" : ".js")

  const tabList = [
    { value: "animation", label: "Animation Only" },
    { value: "complete", label: "Complete Component" },
    ...(extraTabs ?? []),
  ]

  return (
    <div className="space-y-5">
      {/* Framework & Language selectors */}
      <div className="flex items-center gap-4">
        {/* Framework chips */}
        <div className="flex items-center gap-1 bg-muted/25 border border-ring/45 rounded-lg p-1">
          {frameworkOptions.map((fw) => {
            const Icon = fw.icon
            const isActive = framework === fw.value
            return (
              <button
                key={fw.value}
                onClick={() => onFrameworkChange(fw.value)}
                aria-pressed={isActive}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md border cursor-pointer text-xs font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-card text-foreground font-semibold border-ring/70 shadow-[inset_0_-2px_0_0_var(--primary)]"
                    : "border-border bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground hover:border-muted-foreground/40"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? fw.color : ""}`} />
                {fw.label}
              </button>
            )
          })}
        </div>

        {/* Language chips */}
        <div className="flex items-center gap-1 bg-muted/25 border border-ring/45 rounded-lg p-1">
          {languageOptions.map((lang) => {
            const Icon = lang.icon
            const isActive = language === lang.value
            return (
              <button
                key={lang.value}
                onClick={() => onLanguageChange(lang.value)}
                aria-pressed={isActive}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md border cursor-pointer text-xs font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-card text-foreground font-semibold border-ring/70 shadow-[inset_0_-2px_0_0_var(--primary)]"
                    : "border-border bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground hover:border-muted-foreground/40"
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
        <TabsList className="grid w-full h-9" style={{ gridTemplateColumns: `repeat(${tabList.length}, 1fr)` }}>
          {tabList.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs gap-1.5">
              {tab.value === "animation" ? <Code2 className="h-3.5 w-3.5" /> : tab.value === "complete" ? <FileCode className="h-3.5 w-3.5" /> : null}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="animation" className="mt-3">
          <CodeBlock
            label="Animation Code"
            icon={<activeFramework.icon className={`h-3.5 w-3.5 ${activeFramework.color}`} />}
            code={generated.animation}
          />
        </TabsContent>

        <TabsContent value="complete" className="mt-3">
          <CodeBlock
            label="Complete Component"
            icon={<activeFramework.icon className={`h-3.5 w-3.5 ${activeFramework.color}`} />}
            code={generated.complete}
          />
        </TabsContent>

        {(extraTabs ?? []).map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-3">
            {tab.render()}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
