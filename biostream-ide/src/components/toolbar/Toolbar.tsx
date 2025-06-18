'use client'

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { setIsExecuting, undo, redo, saveToHistory, removeNode, removeEdge, setSelectedNodes, setSelectedEdges } from '@/store/workflowSlice'
import { Play, Square, RotateCcw, RotateCw, Save, FolderOpen, Download, Upload, Trash2, MousePointer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'

export const Toolbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const isExecuting = useSelector((state: RootState) => state.workflow.isExecuting)
  const project = useSelector((state: RootState) => state.workflow.project)
  const selectedNodes = useSelector((state: RootState) => state.workflow.selectedNodes)
  const selectedEdges = useSelector((state: RootState) => state.workflow.selectedEdges)

  const handleRunWorkflow = () => {
    dispatch(setIsExecuting(true))
    // TODO: Implement workflow execution
    setTimeout(() => {
      dispatch(setIsExecuting(false))
    }, 2000)
  }

  const handleStopWorkflow = () => {
    dispatch(setIsExecuting(false))
    // TODO: Implement workflow stop
  }

  const handleDelete = () => {
    if (selectedNodes.length === 0 && selectedEdges.length === 0) {
      alert('No items selected to delete')
      return
    }

    const totalItems = selectedNodes.length + selectedEdges.length
    const confirmMessage = `Are you sure you want to delete ${totalItems} selected item${totalItems > 1 ? 's' : ''}?`
    
    if (confirm(confirmMessage)) {
      // Delete selected nodes
      selectedNodes.forEach(nodeId => {
        dispatch(removeNode(nodeId))
      })
      
      // Delete selected edges
      selectedEdges.forEach(edgeId => {
        dispatch(removeEdge(edgeId))
      })
      
      // Clear selection
      dispatch(setSelectedNodes([]))
      dispatch(setSelectedEdges([]))
    }
  }

  const handleSelectAll = () => {
    if (project) {
      const allNodeIds = project.nodes.map(node => node.id)
      const allEdgeIds = project.edges.map(edge => edge.id)
      dispatch(setSelectedNodes(allNodeIds))
      dispatch(setSelectedEdges(allEdgeIds))
    }
  }

  const handleClearSelection = () => {
    dispatch(setSelectedNodes([]))
    dispatch(setSelectedEdges([]))
  }

  const handleUndo = () => {
    dispatch(undo())
  }

  const handleRedo = () => {
    dispatch(redo())
  }

  const handleSave = () => {
    dispatch(saveToHistory())
    // TODO: Implement project save
    console.log('Saving project:', project)
  }

  const handleOpen = () => {
    // TODO: Implement project open
    console.log('Opening project')
  }

  const handleExport = () => {
    if (project) {
      const dataStr = JSON.stringify(project, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${project.name || 'workflow'}.json`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const projectData = JSON.parse(e.target?.result as string)
            // TODO: Implement project import
            console.log('Imported project:', projectData)
          } catch (error) {
            console.error('Error parsing project file:', error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <Card className="border-0 rounded-none border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left Section - Project Info */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">
              {project?.name || 'Untitled Workflow'}
            </h1>
            {project && (
              <p className="text-sm text-slate-500">
                {project.nodes.length} nodes, {project.edges.length} connections
              </p>
            )}
          </div>
          {(selectedNodes.length > 0 || selectedEdges.length > 0) && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <MousePointer size={12} className="mr-1" />
              {selectedNodes.length} nodes, {selectedEdges.length} edges selected
            </Badge>
          )}
        </div>

        {/* Center Section - Execution Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRunWorkflow}
            disabled={isExecuting}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
          >
            <Play size={16} className="mr-2" />
            Run Workflow
          </Button>
          
          <Button
            onClick={handleStopWorkflow}
            disabled={!isExecuting}
            variant="destructive"
            size="sm"
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Square size={16} className="mr-2" />
            Stop
          </Button>
        </div>

        {/* Right Section - Project Actions */}
        <div className="flex items-center gap-2">
          {/* Selection Controls */}
          <div className="flex items-center gap-1">
            <Button
              onClick={handleSelectAll}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Select All (Ctrl+A)"
            >
              <MousePointer size={16} />
            </Button>
            
            <Button
              onClick={handleClearSelection}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Clear Selection (Esc)"
            >
              <MousePointer size={16} />
            </Button>
            
            <Button
              onClick={handleDelete}
              disabled={selectedNodes.length === 0 && selectedEdges.length === 0}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete Selected (Delete)"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* History Controls */}
          <div className="flex items-center gap-1">
            <Button
              onClick={handleUndo}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw size={16} />
            </Button>
            
            <Button
              onClick={handleRedo}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Redo (Ctrl+Y)"
            >
              <RotateCw size={16} />
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Project Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save size={16} className="mr-2" />
              Save
            </Button>
            
            <Button
              onClick={handleOpen}
              variant="outline"
              size="sm"
            >
              <FolderOpen size={16} className="mr-2" />
              Open
            </Button>
            
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
            
            <Button
              onClick={handleImport}
              variant="outline"
              size="sm"
            >
              <Upload size={16} className="mr-2" />
              Import
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
} 