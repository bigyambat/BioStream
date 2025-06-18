'use client'

import React, { useState } from 'react'
import { getTemplatesByCategory, nodeTemplates } from '@/data/nodeTemplates'
import { NodeTemplate } from '@/types/workflow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react'

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, template: NodeTemplate) => void
}

export const NodePalette: React.FC<NodePaletteProps> = ({ onDragStart }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  
  const categories = getTemplatesByCategory()
  const allCategories = ['All', ...categories.map(cat => cat.category)]

  const filteredTemplates = nodeTemplates.filter(template => {
    const matchesSearch = template.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const getCategoryTemplates = (category: string) => {
    return nodeTemplates.filter(template => template.category === category)
  }

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Header */}
      <Card className="border-0 rounded-none border-b border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Search size={20} className="text-slate-600" />
            Node Palette
          </CardTitle>
          <p className="text-sm text-slate-600">Drag nodes to canvas</p>
        </CardHeader>
      </Card>

      {/* Search */}
      <div className="p-4 border-b border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
          <Input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={16} className="text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Category</span>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 bg-white"
        >
          {allCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Node Templates */}
      <div className="flex-1 overflow-y-auto">
        {selectedCategory === 'All' ? (
          // Show all categories when "All" is selected
          <div className="p-4 space-y-4">
            {categories.map(({ category }) => {
              const categoryTemplates = getCategoryTemplates(category)
              const isExpanded = expandedCategories.has(category)
              
              return (
                <Card key={category} className="border-slate-200">
                  <CardHeader 
                    className="pb-2 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-700">
                        {category}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {categoryTemplates.length}
                      </Badge>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </CardHeader>
                  {isExpanded && (
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {categoryTemplates.map((template) => (
                          <div
                            key={`${template.type}-${template.label}`}
                            draggable
                            onDragStart={(e) => onDragStart(e, template)}
                            className="p-3 border border-slate-200 rounded-lg cursor-move hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 bg-white"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{template.icon}</span>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm text-slate-800 truncate">
                                  {template.label}
                                </h3>
                                <p className="text-xs text-slate-500 truncate mt-1">
                                  {template.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        ) : (
          // Show filtered templates when specific category is selected
          <div className="p-4">
            {filteredTemplates.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                <Search size={32} className="mx-auto mb-2 text-slate-300" />
                <p>No nodes found</p>
                <p className="text-xs mt-1">Try adjusting your search or category filter</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTemplates.map((template) => (
                  <div
                    key={`${template.type}-${template.label}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, template)}
                    className="p-3 border border-slate-200 rounded-lg cursor-move hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-slate-800 truncate">
                          {template.label}
                        </h3>
                        <p className="text-xs text-slate-500 truncate mt-1">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <Card className="border-0 rounded-none border-t border-slate-200">
        <CardContent className="p-4">
          <div className="text-xs text-slate-500">
            <p className="font-medium">Total: {filteredTemplates.length} nodes</p>
            <p className="mt-1">Drag to canvas to add</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 