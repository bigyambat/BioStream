'use client'

import React, { useState } from 'react'
import { Handle, Position, NodeProps } from '@reactflow/core'
import { cn } from '@/lib/utils'
import { NodeData } from '@/types/workflow'

interface BaseNodeProps extends NodeProps<NodeData> {
  children?: React.ReactNode
  className?: string
}

const statusColors = {
  pending: 'bg-gray-200',
  running: 'bg-blue-200',
  completed: 'bg-green-200',
  failed: 'bg-red-200',
  cached: 'bg-yellow-200'
}

const statusIcons = {
  pending: '⏳',
  running: '🔄',
  completed: '✅',
  failed: '❌',
  cached: '💾'
}

export const BaseNode: React.FC<BaseNodeProps> = ({ 
  data, 
  selected, 
  children,
  className 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={cn(
        'bg-white border-2 rounded-lg shadow-md min-w-[200px]',
        selected ? 'border-blue-500' : 'border-gray-300',
        statusColors[data.status],
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <div>
            <h3 className="font-semibold text-sm">{data.label}</h3>
            <p className="text-xs text-gray-500">{data.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm">{statusIcons[data.status]}</span>
          {data.executionTarget === 'hpc' && (
            <span className="text-xs bg-purple-100 text-purple-800 px-1 rounded">HPC</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {children}
        
        {/* Error Display */}
        {data.error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            <strong>Error:</strong> {data.error}
          </div>
        )}

        {/* Logs */}
        {data.logs && data.logs.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {isExpanded ? 'Hide' : 'Show'} Logs ({data.logs.length})
            </button>
            {isExpanded && (
              <div className="mt-1 p-2 bg-gray-50 border rounded text-xs font-mono max-h-20 overflow-y-auto">
                {data.logs.map((log, index) => (
                  <div key={index} className="text-gray-600">{log}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </div>
  )
} 