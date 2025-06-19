'use client'

import React from 'react'
import { useFlowStore } from '@/store/flowStore'
import { NodeData, EdgeData } from '@/types/workflow'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Copy, Trash2, Edit, Settings, Play, Square } from 'lucide-react'

interface ContextMenuProps {
  x: number;
  y: number;
  nodeId?: string;
  edgeId?: string;
  nodeData?: NodeData;
  edgeData?: EdgeData;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  nodeId,
  edgeId,
  nodeData,
  edgeData,
  onClose
}) => {
  const { deleteNode, deleteEdge } = useFlowStore(state => ({
    deleteNode: state.deleteNode,
    deleteEdge: state.deleteEdge
  }))

  const handleDelete = () => {
    if (nodeId) {
      deleteNode(nodeId)
    } else if (edgeId) {
      deleteEdge(edgeId)
    }
    onClose()
  }

  const handleCopy = () => {
    // TODO: Implement copy functionality
    console.log('Copying...', nodeData || edgeData)
    onClose()
  }

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Editing...', nodeData || edgeData)
    onClose()
  }

  const handleSettings = () => {
    // TODO: Implement settings functionality
    console.log('Opening settings...', nodeData || edgeData)
    onClose()
  }

  const handleRun = () => {
    // TODO: Implement run functionality
    console.log('Running...', nodeData || edgeData)
    onClose()
  }

  const handleStop = () => {
    // TODO: Implement stop functionality
    console.log('Stopping...', nodeData || edgeData)
    onClose()
  }

  return (
    <div
      className="fixed z-50"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <Card className="w-48 shadow-lg border border-slate-200">
        <CardContent className="p-1">
          <div className="flex flex-col">
            {nodeData && (
              <>
                <div className="px-3 py-2 text-sm font-medium text-slate-700 border-b border-slate-100">
                  {nodeData.label}
                </div>
                <div className="p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRun}
                    className="w-full justify-start"
                  >
                    <Play size={14} className="mr-2" />
                    Run
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStop}
                    className="w-full justify-start"
                  >
                    <Square size={14} className="mr-2" />
                    Stop
                  </Button>
                  <Separator className="my-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="w-full justify-start"
                  >
                    <Edit size={14} className="mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSettings}
                    className="w-full justify-start"
                  >
                    <Settings size={14} className="mr-2" />
                    Settings
                  </Button>
                  <Separator className="my-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="w-full justify-start"
                  >
                    <Copy size={14} className="mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="w-full justify-start text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </>
            )}
            
            {edgeData && (
              <>
                <div className="px-3 py-2 text-sm font-medium text-slate-700 border-b border-slate-100">
                  Connection
                </div>
                <div className="p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="w-full justify-start"
                  >
                    <Edit size={14} className="mr-2" />
                    Edit
                  </Button>
                  <Separator className="my-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="w-full justify-start"
                  >
                    <Copy size={14} className="mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="w-full justify-start text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 