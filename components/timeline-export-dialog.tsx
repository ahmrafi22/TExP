"use client"

import { useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Code2, Download, Upload } from "lucide-react"
import CodeGenerator, { type ExportFramework, type ExportLanguage } from "@/components/code-generator"
import { useTimelineProjectStore, useTimelineUiStore } from "@/store/use-timeline-store"
import { generateTimelineCode } from "@/utils/timeline-code-generator"

export default function TimelineExportDialog() {
  const project = useTimelineProjectStore((s) => s.project)
  const loadProject = useTimelineProjectStore((s) => s.loadProject)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const exportFramework = useTimelineUiStore((s) => s.exportFramework)
  const exportLanguage = useTimelineUiStore((s) => s.exportLanguage)
  const setExportFramework = useTimelineUiStore((s) => s.setExportFramework)
  const setExportLanguage = useTimelineUiStore((s) => s.setExportLanguage)

  const handleImport = () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return
    // Allow importing the same file again later
    if (fileInputRef.current) fileInputRef.current.value = ""
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string)
        if (parsed && parsed.items && Array.isArray(parsed.items)) {
          loadProject(parsed)
        }
      } catch { /* invalid JSON */ }
    }
    reader.readAsText(file)
  }

  const json = generateTimelineCode({ project, framework: "vanilla", language: "ts" }).json

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Code2 className="h-3.5 w-3.5" />
          Get Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <Code2 className="h-4 w-4 text-ring" />
            Export GSAP Timeline
          </DialogTitle>
        </DialogHeader>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleImport}
        />

        <div className="mt-2">
          <CodeGenerator
            source={{
              framework: exportFramework as ExportFramework,
              language: exportLanguage as ExportLanguage,
              onFrameworkChange: setExportFramework,
              onLanguageChange: setExportLanguage,
              generate: (fw, lang) => generateTimelineCode({ project, framework: fw, language: lang }),
            }}
            extraTabs={[
              {
                value: "json",
                label: "Project JSON",
                render: () => (
                  <div className="space-y-2">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1.5 text-xs"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-3 w-3" />
                        Import
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1.5 text-xs"
                        onClick={() => {
                          const blob = new Blob([json], { type: "application/json" })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = "timeline-project.json"
                          a.click()
                          URL.revokeObjectURL(url)
                        }}
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border border-border">
                      <pre className="code-panel p-4 text-sm overflow-auto max-h-[350px] min-h-[200px] custom-scrollbar">
                        <code>{json}</code>
                      </pre>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
