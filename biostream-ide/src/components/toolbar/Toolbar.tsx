'use client'

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { setIsExecuting, undo, redo, saveToHistory } from '@/store/workflowSlice'
import { Play, Square, RotateCcw, RotateCw, Save, FolderOpen, Download, Upload } from 'lucide-react'

export const Toolbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const isExecuting = useSelector((state: RootState) => state.workflow.isExecuting)
  const project = useSelector((state: RootState) => state.workflow.project)

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
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      {/* Left Section - Project Info */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-800">
          {project?.name || 'Untitled Workflow'}
        </h1>
        {project && (
          <span className="text-sm text-gray-500">
            {project.nodes.length} nodes, {project.edges.length} connections
          </span>
        )}
      </div>

      {/* Center Section - Execution Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleRunWorkflow}
          disabled={isExecuting}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={16} />
          Run Workflow
        </button>
        
        <button
          onClick={handleStopWorkflow}
          disabled={!isExecuting}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Square size={16} />
          Stop
        </button>
      </div>

      {/* Right Section - Project Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleUndo}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
          title="Undo"
        >
          <RotateCcw size={16} />
        </button>
        
        <button
          onClick={handleRedo}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
          title="Redo"
        >
          <RotateCw size={16} />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Save size={16} />
          Save
        </button>
        
        <button
          onClick={handleOpen}
          className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          <FolderOpen size={16} />
          Open
        </button>
        
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          <Download size={16} />
          Export
        </button>
        
        <button
          onClick={handleImport}
          className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          <Upload size={16} />
          Import
        </button>
      </div>
    </div>
  )
} 