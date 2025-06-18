'use client'

import React from 'react'
import { NodeProps } from '@reactflow/core'
import { NodeData } from '@/types/workflow'
import { RScriptNode } from './RScriptNode'
import { BaseNode } from './BaseNode'

export const NodeFactory: React.FC<NodeProps<NodeData>> = (props) => {
  const { data } = props

  switch (data.type) {
    case 'r-script':
      return <RScriptNode {...props} />
    
    case 'data-source':
      return (
        <BaseNode {...props}>
          <div className="space-y-2">
            <div className="text-xs text-gray-600">
              <strong>Source:</strong> Data Source Node
            </div>
            {data.params && Object.keys(data.params).length > 0 && (
              <div className="text-xs">
                <strong>Parameters:</strong>
                <ul className="mt-1 space-y-1">
                  {Object.entries(data.params).map(([key, value]) => (
                    <li key={key} className="text-gray-600">
                      {key}: {String(value)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </BaseNode>
      )
    
    case 'transform':
      return (
        <BaseNode {...props}>
          <div className="space-y-2">
            <div className="text-xs text-gray-600">
              <strong>Operation:</strong> {data.label}
            </div>
            {data.params && Object.keys(data.params).length > 0 && (
              <div className="text-xs">
                <strong>Parameters:</strong>
                <ul className="mt-1 space-y-1">
                  {Object.entries(data.params).map(([key, value]) => (
                    <li key={key} className="text-gray-600">
                      {key}: {String(value)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </BaseNode>
      )
    
    case 'visualization':
      return (
        <BaseNode {...props}>
          <div className="space-y-2">
            <div className="text-xs text-gray-600">
              <strong>Chart Type:</strong> {data.label}
            </div>
            {data.code && (
              <div className="bg-gray-50 border rounded p-2">
                <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap max-h-16 overflow-y-auto">
                  {data.code}
                </pre>
              </div>
            )}
          </div>
        </BaseNode>
      )
    
    case 'control':
      return (
        <BaseNode {...props}>
          <div className="space-y-2">
            <div className="text-xs text-gray-600">
              <strong>Control Type:</strong> {data.label}
            </div>
            {data.code && (
              <div className="bg-gray-50 border rounded p-2">
                <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap max-h-16 overflow-y-auto">
                  {data.code}
                </pre>
              </div>
            )}
          </div>
        </BaseNode>
      )
    
    default:
      return (
        <BaseNode {...props}>
          <div className="text-xs text-gray-500">Unknown node type</div>
        </BaseNode>
      )
  }
} 