'use client'

import React, { useCallback } from 'react'
import { NodePalette } from '../palette/NodePalette'
import { WorkflowCanvasProvider } from '../canvas/WorkflowCanvas'
import { NodeTemplate } from '@/types/workflow'
import { Toolbar } from '../toolbar/Toolbar'

export const MainLayout: React.FC = () => {
  const handleDragStart = useCallback((event: React.DragEvent, template: NodeTemplate) => {
    console.log('Drag start - template:', template);
    event.dataTransfer.setData('application/reactflow', template.type)
    event.dataTransfer.effectAllowed = 'move'
    console.log('Drag start - dataTransfer set to:', template.type);
  }, [])

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Left Sidebar - Node Palette */}
      <NodePalette onDragStart={handleDragStart} />
      
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <Toolbar />
        
        {/* Canvas */}
        <div className="flex-1 overflow-hidden">
          <WorkflowCanvasProvider />
        </div>
      </div>
    </div>
  )
} 