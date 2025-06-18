'use client'

import React, { useState } from 'react'
import { getTemplatesByCategory, nodeTemplates } from '@/data/nodeTemplates'
import { NodeTemplate } from '@/types/workflow'
import { cn } from '@/lib/utils'

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, template: NodeTemplate) => void
}

export const NodePalette: React.FC<NodePaletteProps> = ({ onDragStart }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  
  const categories = getTemplatesByCategory()
  const allCategories = ['All', ...categories.map(cat => cat.category)]

  const filteredTemplates = nodeTemplates.filter(template => {
    const matchesSearch = template.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Node Palette</h2>
        <p className="text-sm text-gray-600 mt-1">Drag nodes to canvas</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b border-gray-200">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {allCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Node Templates */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredTemplates.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No nodes found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTemplates.map((template) => (
              <div
                key={`${template.type}-${template.label}`}
                draggable
                onDragStart={(e) => onDragStart(e, template)}
                className={cn(
                  'p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors',
                  'bg-white'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-800 truncate">
                      {template.label}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {template.description}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {template.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          <p>Total: {filteredTemplates.length} nodes</p>
          <p className="mt-1">Drag to canvas to add</p>
        </div>
      </div>
    </div>
  )
} 