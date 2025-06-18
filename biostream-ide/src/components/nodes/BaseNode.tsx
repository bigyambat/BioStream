'use client'

import React from 'react'
import { Handle, Position, NodeProps, useReactFlow } from '@reactflow/core'
import { NodeResizer } from '@reactflow/node-resizer'
import { NodeData } from '@/types/workflow'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Settings, Play, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

interface BaseNodeProps extends NodeProps<NodeData> {
  onDelete?: (nodeId: string) => void
  onEdit?: (nodeId: string) => void
  onRun?: (nodeId: string) => void
  children?: React.ReactNode
  className?: string
}

export const BaseNode: React.FC<BaseNodeProps> = ({ 
  data, 
  selected, 
  onDelete, 
  onEdit, 
  onRun, 
  children,
  className
}) => {
  const { setNodes } = useReactFlow()

  const getStatusIcon = () => {
    switch (data.status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />
      case 'running':
        return <Clock size={16} className="text-blue-600 animate-spin" />
      case 'failed':
        return <XCircle size={16} className="text-red-600" />
      case 'pending':
        return <AlertCircle size={16} className="text-yellow-600" />
      default:
        return <AlertCircle size={16} className="text-gray-400" />
    }
  }

  const getStatusColor = () => {
    switch (data.status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'running':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getExecutionTargetColor = () => {
    switch (data.executionTarget) {
      case 'local':
        return 'bg-slate-100 text-slate-700'
      case 'hpc':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Handler to update node width/height in React Flow state
  const handleResize = (_event: unknown, { width, height }: { width: number; height: number }) => {
    setNodes((nds) => nds.map((node) =>
      node.id === data.id ? { ...node, width, height } : node
    ))
  }

  return (
    <Card 
      style={{ width: data.width, height: data.height }}
      className={`
        max-w-[400px] shadow-lg border-2 transition-all duration-200
        ${selected 
          ? 'border-blue-500 ring-2 ring-blue-300 shadow-blue-200/50' 
          : 'border-slate-200 hover:border-slate-300'
        }
        ${data.status === 'running' ? 'animate-pulse' : ''}
        ${className || ''}
      `}
    >
      {/* Node Resizer (only visible when selected) */}
      <NodeResizer 
        isVisible={selected} 
        minWidth={180} 
        minHeight={100} 
        lineClassName="border-blue-200" 
        handleClassName="bg-blue-400 border-white w-2 h-2" 
        color="#3b82f6"
        keepAspectRatio={false}
        onResize={handleResize}
      />
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-slate-400 border-2 border-white"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />

      {/* Node Header */}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{data.icon || '📊'}</span>
            <CardTitle className="text-sm font-medium text-slate-800 truncate">
              {data.label}
            </CardTitle>
          </div>
          
          {/* Status Badge */}
          <Badge 
            variant="outline" 
            className={`text-xs px-2 py-1 ${getStatusColor()}`}
          >
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <span className="capitalize">{data.status}</span>
            </div>
          </Badge>
        </div>

        {/* Execution Target */}
        <Badge 
          variant="secondary" 
          className={`text-xs ${getExecutionTargetColor()}`}
        >
          {data.executionTarget === 'hpc' ? 'HPC (Slurm)' : 'Local'}
        </Badge>
      </CardHeader>

      {/* Node Content */}
      <CardContent className="pt-0">
        <div className="space-y-2">
          {/* Description */}
          {data.description && (
            <p className="text-xs text-slate-600 line-clamp-2">
              {data.description}
            </p>
          )}

          {/* Parameters */}
          {data.params && Object.keys(data.params).length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-700">Parameters:</p>
              <div className="text-xs text-slate-600 space-y-1">
                {Object.entries(data.params).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium">{key}:</span>
                    <span className="truncate ml-2">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Content */}
          {children}

          {/* Action Buttons */}
          <div className="flex items-center gap-1 pt-2">
            {onRun && (
              <Button
                onClick={() => onRun(data.id)}
                disabled={data.status === 'running'}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50"
                title="Run Node"
              >
                <Play size={12} />
              </Button>
            )}
            
            {onEdit && (
              <Button
                onClick={() => onEdit(data.id)}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                title="Edit Node"
              >
                <Settings size={12} />
              </Button>
            )}
            
            {onDelete && (
              <Button
                onClick={() => onDelete(data.id)}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs bg-red-50 text-red-700 hover:bg-red-100"
                title="Delete Node"
              >
                <Trash2 size={12} />
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-slate-400 border-2 border-white"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
    </Card>
  )
}