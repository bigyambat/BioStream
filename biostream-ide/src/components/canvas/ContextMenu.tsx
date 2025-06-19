'use client'

import React from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { removeNode, removeEdge, copyToClipboard } from '@/store/workflowSlice'
import { NodeData, EdgeData } from '@/types/workflow'
import { Trash2, Copy, Scissors } from 'lucide-react'

interface ContextMenuProps {
  x: number
  y: number
  nodeId?: string
  edgeId?: string
  nodeData?: NodeData
  edgeData?: EdgeData
  onClose: () => void
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
  const dispatch = useDispatch<AppDispatch>()

  const handleDelete = () => {
    if (nodeId) {
      if (confirm(`Are you sure you want to delete "${nodeData?.label || 'this node'}"?`)) {
        dispatch(removeNode(nodeId))
      }
    } else if (edgeId) {
      if (confirm('Are you sure you want to delete this connection?')) {
        dispatch(removeEdge(edgeId))
      }
    }
    onClose()
  }

  const handleCopy = () => {
    if (nodeData) {
      dispatch(copyToClipboard({
        nodes: [nodeData],
        edges: []
      }))
    }
    onClose()
  }

  const handleCut = () => {
    if (nodeData) {
      dispatch(copyToClipboard({
        nodes: [nodeData],
        edges: []
      }))
      if (nodeId) {
        dispatch(removeNode(nodeId))
      }
    }
    onClose()
  }

  const menuItems = []

  if (nodeId && nodeData) {
    menuItems.push(
      <button
        key="copy"
        onClick={handleCopy}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
      >
        <Copy size={14} />
        Copy Node
      </button>,
      <button
        key="cut"
        onClick={handleCut}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
      >
        <Scissors size={14} />
        Cut Node
      </button>,
      <div key="divider" className="border-t border-gray-200 my-1" />,
      <button
        key="delete"
        onClick={handleDelete}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
      >
        <Trash2 size={14} />
        Delete Node
      </button>
    )
  } else if (edgeId && edgeData) {
    menuItems.push(
      <button
        key="delete"
        onClick={handleDelete}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
      >
        <Trash2 size={14} />
        Delete Connection
      </button>
    )
  }

  if (menuItems.length === 0) {
    return null
  }

  return (
    <div
      className="fixed z-50 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px] pointer-events-none"
      style={{
        left: x,
        top: y,
      }}
    >
      {menuItems.map((item, index) => 
        React.cloneElement(item, {
          key: index,
          className: `${item.props.className} pointer-events-auto`
        })
      )}
    </div>
  )
} 