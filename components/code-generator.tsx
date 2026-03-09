"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy } from "lucide-react"
import type { AnimationConfig, BackgroundConfig } from "@/types/animation"
import { generateCode } from "@/utils/code-generator"

interface CodeGeneratorProps {
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

export default function CodeGenerator({
  text,
  animationConfig,
  backgroundConfig,
  splitTextConfig,
  framework,
  language,
  onFrameworkChange,
  onLanguageChange,
}: CodeGeneratorProps) {
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

  return (
    <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg dark:text-white">Generated Code</CardTitle>
        <div className="flex gap-2">
          <Select value={framework} onValueChange={onFrameworkChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vanilla">Vanilla JS</SelectItem>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="vue">Vue</SelectItem>
            </SelectContent>
          </Select>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="js">JS</SelectItem>
              <SelectItem value="ts">TS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="animation" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="animation">Animation</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
          </TabsList>

          <TabsContent value="animation" className="space-y-4">
            <div className="relative">
              <pre className="bg-gray-900 dark:bg-gray-950 text-green-400 dark:text-green-300 p-4 rounded-lg text-sm overflow-auto max-h-[300px] min-h-[250px]">
                <code>{generatedCode.animation}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 dark:bg-transparent"
                onClick={() => copyToClipboard(generatedCode.animation, "animation")}
              >
                <Copy className="w-4 h-4" />
                {copiedCode === "animation" ? "Copied!" : "Copy"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="complete" className="space-y-4">
            <div className="relative">
              <pre className="bg-gray-900 dark:bg-gray-950 text-green-400 dark:text-green-300 p-4 rounded-lg text-sm overflow-auto max-h-[300px] min-h-[250px]">
                <code>{generatedCode.complete}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 dark:bg-transparent"
                onClick={() => copyToClipboard(generatedCode.complete, "complete")}
              >
                <Copy className="w-4 h-4" />
                {copiedCode === "complete" ? "Copied!" : "Copy"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
