
'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface RStudioPanelProps {
  code: string
  onCodeChange: (code: string) => void
  onClose: () => void
}

const RStudioPanel = ({ code, onCodeChange, onClose }: RStudioPanelProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-3/4 h-3/4 bg-white shadow-2xl rounded-lg flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">R Script Editor</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 p-4">
          {/* Left side: Code Editor */}
          <div className="flex flex-col">
            <h3 className="text-md font-semibold mb-2">Code</h3>
            <div className="flex-1 bg-slate-50 rounded p-2">
              <textarea
                className="w-full h-full bg-transparent border-0 resize-none font-mono text-sm"
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
              />
            </div>
          </div>

          {/* Right side: Variables */}
          <div className="flex flex-col">
            <h3 className="text-md font-semibold mb-2">Variables</h3>
            <div className="flex-1 bg-slate-50 rounded p-2">
              {/* Placeholder for variables */}
              <p className="text-sm text-slate-500">Variables will be displayed here.</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-t">
          {/* Bottom: Terminal */}
          <h3 className="text-md font-semibold mb-2">Terminal</h3>
          <div className="h-32 bg-black text-white font-mono text-sm rounded p-2">
            {/* Placeholder for terminal */}
            <p>&gt; R Interactive Terminal</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default RStudioPanel
