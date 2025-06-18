'use client'

import React, { useCallback } from 'react'
import { NodePalette } from '../palette/NodePalette'
import { WorkflowCanvasProvider } from '../canvas/WorkflowCanvas'
import { NodeTemplate } from '@/types/workflow'
import { Toolbar } from '../toolbar/Toolbar'

export const MainLayout: React.FC = () => {
  const handleDragStart = useCallback((event: React.DragEvent, template: NodeTemplate) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(template))
    event.dataTransfer.effectAllowed = 'move'
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Node Palette */}
      <NodePalette onDragStart={handleDragStart} />
      
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <Toolbar />
        
        {/* Canvas */}
        <div className="flex-1">
          <WorkflowCanvasProvider />
        </div>
      </div>
    </div>
  )
} 