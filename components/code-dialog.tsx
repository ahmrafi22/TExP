"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Code2 } from "lucide-react"
import CodeGenerator from "@/components/code-generator"

export default function CodeDialog() {
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
            <Code2 className="h-4 w-4 text-violet-500" />
            Export Code
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <CodeGenerator />
        </div>
      </DialogContent>
    </Dialog>
  )
}
