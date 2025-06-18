'use client'

import React, { useCallback, useRef, useState } from 'react'
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
  ReactFlowInstance
} from '@reactflow/core'
import { Controls } from '@reactflow/controls'
import { Background } from '@reactflow/background'
import { MiniMap } from '@reactflow/minimap'
import { NodeFactory } from '../nodes/NodeFactory'
import { NodeTemplate } from '@/types/workflow'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { addNode, addEdge as addEdgeAction, removeNode, removeEdge, setSelectedNodes, setSelectedEdges } from '@/store/workflowSlice'
import { generateId } from '@/lib/utils'

const nodeTypes = {
  'r-script': NodeFactory,
  'data-source': NodeFactory,
  'transform': NodeFactory,
  'visualization': NodeFactory,
  'control': NodeFactory,
}

export const WorkflowCanvas: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const project = useSelector((state: RootState) => state.workflow.project)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

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

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        id: generateId(),
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
        type: 'data-flow' as const,
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

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const template: NodeTemplate = JSON.parse(event.dataTransfer.getData('application/reactflow'))

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode = {
        id: generateId(),
        type: template.type,
        label: template.label,
        position,
        status: 'pending' as const,
        code: template.defaultCode,
        params: template.defaultParams,
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
    },
    [reactFlowInstance, setNodes, dispatch]
  )

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

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onNodeDragStop={onNodeDragStop}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-gray-50"
      >
        <Controls />
        <Background color="#aaa" gap={16} />
        <MiniMap
          nodeColor={(node: Node) => {
            switch (node.data?.status) {
              case 'completed': return '#10b981'
              case 'running': return '#3b82f6'
              case 'failed': return '#ef4444'
              default: return '#6b7280'
            }
          }}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
      </ReactFlow>
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