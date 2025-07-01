'use client'

import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card } from '@/components/ui/card'
import { NodeData } from '@/types/workflow'

const RScriptNode = memo(({ data }: NodeProps) => {
  const nodeData = data as NodeData;
  
  return (
    <Card className="w-[200px] min-h-[80px] bg-white border shadow-sm">
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{nodeData.icon || '📊'}</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-slate-900 truncate">
              {nodeData.label}
            </h4>
            {nodeData.description && (
              <p className="text-xs text-slate-500 truncate">
                {nodeData.description}
              </p>
            )}
          </div>
        </div>

        {nodeData.code && (
          <div className="mt-2 bg-slate-50 rounded p-2">
            <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap max-h-24 overflow-y-auto">
              {nodeData.code}
            </pre>
          </div>
        )}

        {/* Input Handle */}
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 border-2 bg-white border-slate-400 rounded-full"
          style={{ left: '-11px' }}
        />

        {/* Output Handle */}
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 border-2 bg-white border-slate-400 rounded-full"
          style={{ right: '-11px' }}
        />
      </div>
    </Card>
  )
})

RScriptNode.displayName = 'RScriptNode'

export default RScriptNode;