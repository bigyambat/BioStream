'use client'

import React, { useState } from 'react'
import { NodeProps } from '@reactflow/core'
import { BaseNode } from './BaseNode'
import { NodeData } from '@/types/workflow'
import { useDispatch } from 'react-redux'
import { updateNode } from '@/store/workflowSlice'
import { AppDispatch } from '@/store'

export const RScriptNode: React.FC<NodeProps<NodeData>> = ({ data, id, selected, type, zIndex, xPos, yPos, dragging, targetPosition, sourcePosition, isConnectable }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isEditing, setIsEditing] = useState(false)
  const [code, setCode] = useState(data.code || '# Your R code here\n')

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '')
  }

  const handleSave = () => {
    dispatch(updateNode({ id, updates: { code } }))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setCode(data.code || '# Your R code here\n')
    setIsEditing(false)
  }

  return (
    <BaseNode 
      data={data} 
      id={id}
      selected={selected}
      type={type}
      zIndex={zIndex}
      xPos={xPos}
      yPos={yPos}
      dragging={dragging}
      targetPosition={targetPosition}
      sourcePosition={sourcePosition}
      isConnectable={isConnectable}
      className="min-w-[300px]"
    >
      <div className="space-y-2">
        {/* Code Preview/Editor */}
        <div className="relative">
          {isEditing ? (
            <div className="space-y-2">
              <div className="bg-gray-50 border rounded p-2">
                <textarea
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="w-full h-32 p-2 text-xs font-mono bg-white border rounded resize-none"
                  placeholder="# Your R code here"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="bg-gray-50 border rounded p-2">
                <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap max-h-20 overflow-y-auto">
                  {data.code || '# Your R code here'}
                </pre>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit Code
              </button>
            </div>
          )}
        </div>

        {/* Execution Target */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium">Execution Target:</label>
          <select
            value={data.executionTarget || 'local'}
            onChange={(e) => dispatch(updateNode({ 
              id, 
              updates: { executionTarget: e.target.value as 'local' | 'hpc' } 
            }))}
            className="text-xs border rounded px-2 py-1"
          >
            <option value="local">Local</option>
            <option value="hpc">HPC (Slurm)</option>
          </select>
        </div>

        {/* Resource Spec (for HPC) */}
        {data.executionTarget === 'hpc' && (
          <div className="space-y-2 p-2 bg-purple-50 border border-purple-200 rounded">
            <h4 className="text-xs font-medium text-purple-800">HPC Resources</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-purple-700">CPU:</label>
                <input
                  type="number"
                  value={data.resources?.cpu || 1}
                  onChange={(e) => dispatch(updateNode({ 
                    id, 
                    updates: { 
                      resources: { 
                        ...data.resources, 
                        cpu: parseInt(e.target.value) || 1 
                      } 
                    } 
                  }))}
                  className="w-full text-xs border rounded px-1 py-1"
                  min="1"
                />
              </div>
              <div>
                <label className="text-xs text-purple-700">Memory (GB):</label>
                <input
                  type="number"
                  value={data.resources?.memory || 4}
                  onChange={(e) => dispatch(updateNode({ 
                    id, 
                    updates: { 
                      resources: { 
                        ...data.resources, 
                        memory: parseInt(e.target.value) || 4 
                      } 
                    } 
                  }))}
                  className="w-full text-xs border rounded px-1 py-1"
                  min="1"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-purple-700">Time Limit:</label>
              <input
                type="text"
                value={data.resources?.time || '01:00:00'}
                onChange={(e) => dispatch(updateNode({ 
                  id, 
                  updates: { 
                    resources: { 
                      ...data.resources, 
                      time: e.target.value 
                    } 
                  } 
                }))}
                className="w-full text-xs border rounded px-1 py-1"
                placeholder="HH:MM:SS"
              />
            </div>
          </div>
        )}
      </div>
    </BaseNode>
  )
} 