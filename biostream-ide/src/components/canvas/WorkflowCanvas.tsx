'use client'

import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  OnNodesDelete,
  OnEdgesDelete,
  NodeDragHandler,
  ReactFlowInstance,
  NodeMouseHandler,
  EdgeMouseHandler,
  useReactFlow,
  Panel
} from '@reactflow/core'
import { Background } from '@reactflow/background'
import { MiniMap } from '@reactflow/minimap'
import { NodeFactory } from '../nodes/NodeFactory'
import { ContextMenu } from './ContextMenu'
import { NodeTemplate, NodeData, EdgeData } from '@/types/workflow'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { addNode, addEdge as addEdgeAction, removeNode, removeEdge, setSelectedNodes, setSelectedEdges } from '@/store/workflowSlice'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, MousePointer, X } from 'lucide-react'
import CustomEdge from '../edges/CustomEdge'

// Generate ID utility function
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

const nodeTypes = {
  'r-script': NodeFactory,
  'data-source': NodeFactory,
  'transform': NodeFactory,
  'visualization': NodeFactory,
  'control': NodeFactory,
}

const edgeTypes = {
  'custom-edge': CustomEdge,
}

// Custom Controls Component
const CustomControls: React.FC = () => {
  const { zoomIn, zoomOut, fitView, setViewport, getZoom } = useReactFlow()
  const [zoom, setZoom] = React.useState(1)

  React.useEffect(() => {
    const updateZoom = () => setZoom(getZoom())
    updateZoom()
    const interval = setInterval(updateZoom, 100)
    return () => clearInterval(interval)
  }, [getZoom])

  return (
    <div className="fixed z-50 bottom-6 right-6 flex flex-row items-center gap-1 bg-white/80 rounded-full shadow p-1 border border-slate-200 backdrop-blur-sm pointer-events-none">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => zoomIn()}
        className="h-8 w-8 p-0 rounded-full pointer-events-auto"
        title="Zoom In (Ctrl/Cmd + = or Scroll)"
      >
        <ZoomIn size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => zoomOut()}
        className="h-8 w-8 p-0 rounded-full pointer-events-auto"
        title="Zoom Out (Ctrl/Cmd + - or Scroll)"
      >
        <ZoomOut size={16} />
      </Button>
      <Badge variant="secondary" className="text-[10px] px-2 py-0.5 font-mono bg-slate-100 border border-slate-200 text-slate-700 pointer-events-auto">
        {Math.round(zoom * 100)}%
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fitView()}
        className="h-8 w-8 p-0 rounded-full pointer-events-auto"
        title="Fit View (Ctrl/Cmd + 0)"
      >
        <Maximize2 size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setViewport({ x: 0, y: 0, zoom: 1 })}
        className="h-8 w-8 p-0 rounded-full pointer-events-auto"
        title="Reset View"
      >
        <RotateCcw size={16} />
      </Button>
    </div>
  )
}

// Selection Info Panel
const SelectionInfo: React.FC = () => {
  const selectedNodes = useSelector((state: RootState) => state.workflow.selectedNodes)
  const selectedEdges = useSelector((state: RootState) => state.workflow.selectedEdges)

  if (selectedNodes.length === 0 && selectedEdges.length === 0) {
    return null
  }

  return (
    <Panel position="top-right" className="mt-4 mr-4 pointer-events-none">
      <Card className="px-3 py-2 shadow-lg border-0 bg-white/90 backdrop-blur-sm pointer-events-auto">
        <div className="flex items-center gap-2">
          <MousePointer size={14} className="text-blue-600" />
          <Badge variant="outline" className="text-xs">
            {selectedNodes.length} nodes, {selectedEdges.length} edges
          </Badge>
        </div>
      </Card>
    </Panel>
  )
}

// Canvas Instructions Component
const CanvasInstructions: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(true)

  if (!isVisible) return null

  return (
    <Panel position="top-left" className="mt-4 ml-4 pointer-events-none">
      <Card className="px-3 py-2 shadow-lg border-0 bg-white/90 backdrop-blur-sm pointer-events-auto max-w-xs">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-slate-800 mb-1">Canvas Controls</h3>
            <div className="text-xs text-slate-600 space-y-1">
              <p>• <strong>Scroll:</strong> Zoom in/out</p>
              <p>• <strong>Drag empty area:</strong> Pan canvas</p>
              <p>• <strong>Space + drag:</strong> Pan mode</p>
              <p>• <strong>Double-click:</strong> Zoom to fit</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
            title="Dismiss"
          >
            <X size={12} />
          </Button>
        </div>
      </Card>
    </Panel>
  )
}

// Interaction Mode Indicator
const InteractionModeIndicator: React.FC = () => {
  const [mode, setMode] = React.useState<'pan' | 'select'>('select')

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat) {
        setMode('pan')
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setMode('select')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <Panel position="bottom-left" className="mb-6 ml-4 pointer-events-none">
      <Badge 
        variant="secondary" 
        className="bg-slate-100/90 backdrop-blur-sm border border-slate-200 text-slate-700 pointer-events-auto"
      >
        <MousePointer size={12} className="mr-1" />
        {mode === 'pan' ? 'Pan Mode' : 'Select Mode'}
      </Badge>
    </Panel>
  )
}

export const WorkflowCanvas: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const project = useSelector((state: RootState) => state.workflow.project)
  const selectedNodes = useSelector((state: RootState) => state.workflow.selectedNodes)
  const selectedEdges = useSelector((state: RootState) => state.workflow.selectedEdges)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    nodeId?: string
    edgeId?: string
    nodeData?: NodeData
    edgeData?: EdgeData
  } | null>(null)

  // Convert project data to React Flow format
  const initialNodes: Node[] = project?.nodes.map(node => ({
    id: node.id,
    type: node.type,
    position: node.position || { x: 0, y: 0 },
    data: node,
  })) || []

  const initialEdges: Edge[] = project?.edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    type: 'smoothstep',
    data: edge,
  })) || []

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Memoize node list for edge creation
  const nodeList = useMemo(() => nodes, [nodes])

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null)
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Delete key - delete selected nodes and edges
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        
        // Delete selected nodes
        selectedNodes.forEach(nodeId => {
          dispatch(removeNode(nodeId))
        })
        
        // Delete selected edges
        selectedEdges.forEach(edgeId => {
          dispatch(removeEdge(edgeId))
        })
      }
      
      // Ctrl/Cmd + A - select all nodes
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault()
        const allNodeIds = nodes.map(node => node.id)
        const allEdgeIds = edges.map(edge => edge.id)
        dispatch(setSelectedNodes(allNodeIds))
        dispatch(setSelectedEdges(allEdgeIds))
      }
      
      // Escape - clear selection and close context menu
      if (event.key === 'Escape') {
        dispatch(setSelectedNodes([]))
        dispatch(setSelectedEdges([]))
        setContextMenu(null)
      }

      // Zoom shortcuts
      if ((event.ctrlKey || event.metaKey) && event.key === '=') {
        event.preventDefault()
        // Zoom in will be handled by React Flow
      }
      if ((event.ctrlKey || event.metaKey) && event.key === '-') {
        event.preventDefault()
        // Zoom out will be handled by React Flow
      }
      if ((event.ctrlKey || event.metaKey) && event.key === '0') {
        event.preventDefault()
        // Reset zoom will be handled by React Flow
      }
      
      // Space + drag to pan (handled by React Flow)
      if (event.key === ' ') {
        event.preventDefault()
        // Space key for panning is handled by React Flow
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [dispatch, selectedNodes, selectedEdges, nodes, edges])

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        id: generateId(),
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
        type: 'custom-edge' as const,
        data: {}
      }
      
      setEdges((eds) => addEdge(params, eds))
      dispatch(addEdgeAction(newEdge))
    },
    [dispatch, setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current || !reactFlowInstance) return

      const template: NodeTemplate = JSON.parse(event.dataTransfer.getData('application/reactflow'))

      // Use screenToFlowPosition if available for accurate drop
      let position
      if (typeof reactFlowInstance.screenToFlowPosition === 'function') {
        position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        })
      } else {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
        position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })
      }

      const newNode = {
        id: generateId(),
        type: template.type,
        label: template.label,
        position,
        status: 'pending' as const,
        code: template.defaultCode,
        params: template.defaultParams as Record<string, string | number | boolean>,
        executionTarget: 'local' as const,
      }

      const reactFlowNode: Node = {
        id: newNode.id,
        type: template.type,
        position,
        data: newNode,
      }

      setNodes((nds) => nds.concat(reactFlowNode))
      dispatch(addNode(newNode))

      // Automatic edge: connect from last selected node or last node to new node
      let fromNodeId: string | undefined
      if (selectedNodes.length > 0) {
        fromNodeId = selectedNodes[selectedNodes.length - 1]
      } else if (nodeList.length > 0) {
        fromNodeId = nodeList[nodeList.length - 1].id
      }
      if (fromNodeId) {
        const newEdge = {
          id: generateId(),
          source: fromNodeId,
          target: newNode.id,
          type: 'custom-edge' as const,
          data: {},
        }
        setEdges((eds) => eds.concat(newEdge))
        dispatch(addEdgeAction(newEdge))
      }
    },
    [reactFlowInstance, setNodes, dispatch, selectedNodes, nodeList, setEdges]
  )

  // Button to connect two selected nodes
  const handleConnectSelected = () => {
    if (selectedNodes.length === 2) {
      const newEdge = {
        id: generateId(),
        source: selectedNodes[0],
        target: selectedNodes[1],
        type: 'custom-edge' as const,
        data: {},
      }
      setEdges((eds) => eds.concat(newEdge))
      dispatch(addEdgeAction(newEdge))
    }
  }

  const onNodesDelete: OnNodesDelete = useCallback(
    (deleted) => {
      deleted.forEach(node => {
        dispatch(removeNode(node.id))
      })
    },
    [dispatch]
  )

  const onEdgesDelete: OnEdgesDelete = useCallback(
    (deleted) => {
      deleted.forEach(edge => {
        dispatch(removeEdge(edge.id))
      })
    },
    [dispatch]
  )

  const onNodeDragStop: NodeDragHandler = useCallback(
    (event, node) => {
      dispatch(addNode({
        ...node.data,
        position: node.position
      }))
    },
    [dispatch]
  )

  const onSelectionChange = useCallback(
    (selectedElements: { nodes: Node[]; edges: Edge[] }) => {
      dispatch(setSelectedNodes(selectedElements.nodes.map(n => n.id)))
      dispatch(setSelectedEdges(selectedElements.edges.map(e => e.id)))
    },
    [dispatch]
  )

  // Context menu handlers
  const onNodeContextMenu: NodeMouseHandler = useCallback(
    (event, node) => {
      event.preventDefault()
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
        nodeData: node.data,
      })
    },
    []
  )

  const onEdgeContextMenu: EdgeMouseHandler = useCallback(
    (event, edge) => {
      event.preventDefault()
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        edgeId: edge.id,
        edgeData: edge.data,
      })
    },
    []
  )

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      setContextMenu(null)
    },
    []
  )

  // Add node click handler
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation()
    dispatch(setSelectedNodes([node.id]))
    dispatch(setSelectedEdges([]))
  }, [dispatch])

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance)
  }, [])

  return (
    <div 
      className="flex-1 h-full relative" 
      ref={reactFlowWrapper}
    >
      {/* Connect Nodes Button */}
      {selectedNodes.length === 2 && (
        <div className="absolute z-50 top-4 left-1/2 -translate-x-1/2 flex justify-center pointer-events-none">
          <Button
            onClick={handleConnectSelected}
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow pointer-events-auto"
          >
            Connect Selected Nodes
          </Button>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onNodeDragStop={onNodeDragStop}
        onSelectionChange={onSelectionChange}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-gradient-to-br from-slate-50 to-slate-100"
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
        minZoom={0.1}
        maxZoom={4}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnScroll={true}
        panOnDrag={true}
        zoomOnDoubleClick={true}
        preventScrolling={true}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        selectNodesOnDrag={true}
        snapToGrid={false}
        snapGrid={[15, 15]}
      >
        <Background 
          color="#94a3b8" 
          gap={20} 
          size={1}
          className="opacity-20"
        />
        <MiniMap
          nodeColor={(node: Node) => {
            switch (node.data?.status) {
              case 'completed': return '#10b981'
              case 'running': return '#3b82f6'
              case 'failed': return '#ef4444'
              default: return '#64748b'
            }
          }}
          nodeStrokeWidth={2}
          zoomable
          pannable
          className="border border-slate-200 rounded-lg shadow-lg bg-white/80 backdrop-blur-sm"
          style={{
            width: 200,
            height: 150,
          }}
        />
        
        {/* Custom Controls */}
        <CustomControls />
        
        {/* Selection Info */}
        <SelectionInfo />
        
        {/* Canvas Instructions */}
        <CanvasInstructions />
        
        {/* Interaction Mode Indicator */}
        <InteractionModeIndicator />
      </ReactFlow>
      
      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          edgeId={contextMenu.edgeId}
          nodeData={contextMenu.nodeData}
          edgeData={contextMenu.edgeData}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}

export const WorkflowCanvasProvider: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas />
    </ReactFlowProvider>
  )
} 