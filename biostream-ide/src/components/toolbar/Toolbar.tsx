'use client'

import React from 'react'
import { Play, Square, RotateCcw, RotateCw, Save, FolderOpen, Download, Upload, Trash2, MousePointer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { useFlowStore } from '@/store/flowStore'

export const Toolbar: React.FC = () => {
  const selectedNodes = useFlowStore(state => state.selectedNodes)
  const selectedEdges = useFlowStore(state => state.selectedEdges)

  const handleRunWorkflow = () => {
    // TODO: Implement workflow execution
    console.log('Running workflow...')
  }

  const handleStopWorkflow = () => {
    // TODO: Implement workflow stop
    console.log('Stopping workflow...')
  }

  const handleUndo = () => {
    // TODO: Implement undo functionality
    console.log('Undo...')
  }

  const handleRedo = () => {
    // TODO: Implement redo functionality
    console.log('Redo...')
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving...')
  }

  const handleOpen = () => {
    // TODO: Implement open functionality
    console.log('Opening...')
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting...')
  }

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log('Importing...')
  }

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Deleting selected items...')
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRunWorkflow}
          className="flex items-center gap-2"
        >
          <Play size={16} />
          Run
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleStopWorkflow}
          className="flex items-center gap-2"
        >
          <Square size={16} />
          Stop
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleUndo}
          className="flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Undo
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRedo}
          className="flex items-center gap-2"
        >
          <RotateCw size={16} />
          Redo
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          Save
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpen}
          className="flex items-center gap-2"
        >
          <FolderOpen size={16} />
          Open
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleImport}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          Import
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {(selectedNodes.length > 0 || selectedEdges.length > 0) && (
          <Card className="px-3 py-2">
            <CardContent className="p-0">
              <div className="flex items-center gap-2">
                <MousePointer size={14} className="text-blue-600" />
                <Badge variant="outline" className="text-xs">
                  {selectedNodes.length} nodes, {selectedEdges.length} edges
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-6 w-6 p-0"
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 