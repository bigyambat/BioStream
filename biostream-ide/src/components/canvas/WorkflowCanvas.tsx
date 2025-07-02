'use client'

import React, { useCallback, useRef } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  OnNodesDelete,
  OnEdgesDelete,
  NodeMouseHandler,
  EdgeMouseHandler,
  useReactFlow,
  Panel,
  Background,
  MiniMap,
  Node,
  Edge
} from '@xyflow/react'
import { ContextMenu } from './ContextMenu'
import { NodeData, EdgeData } from '@/types/workflow'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, MousePointer } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { useFlowStore, FlowState } from '@/store/flowStore'
import nodeTypes from '@/components/nodes/NodeFactory'
import { Hand } from 'lucide-react'
// import FloatingEdge from '@/components/edges/FloatingEdge'

// const edgeTypes = {
//   floating: FloatingEdge,
// }

// Custom Controls Component
const CustomControls: React.FC = () => {
  const { zoomIn, zoomOut, fitView, setViewport, getZoom } = useReactFlow()
  const zoom = useFlowStore(state => state.zoom)
  const setZoom = useFlowStore(state => state.setZoom)
  const interactionMode = useFlowStore(state => state.interactionMode)
  const setInteractionMode = useFlowStore(state => state.setInteractionMode)

  React.useEffect(() => {
    const updateZoom = () => setZoom(getZoom())
    updateZoom()
    const interval = setInterval(updateZoom, 100)
    return () => clearInterval(interval)
  }, [getZoom, setZoom])

  return (
    <div className="fixed z-50 bottom-6 right-6 flex flex-row items-center gap-1 bg-white/80 rounded-full shadow p-1 border border-slate-200 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => zoomIn()}
        className="h-8 w-8 p-0 rounded-full"
        title="Zoom In"
      >
        <ZoomIn size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => zoomOut()}
        className="h-8 w-8 p-0 rounded-full"
        title="Zoom Out"
      >
        <ZoomOut size={16} />
      </Button>
      <Badge variant="secondary" className="text-[10px] px-2 py-0.5 font-mono bg-slate-100 border border-slate-200 text-slate-700">
        {Math.round(zoom * 100)}%
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fitView()}
        className="h-8 w-8 p-0 rounded-full"
        title="Fit View"
      >
        <Maximize2 size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setViewport({ x: 0, y: 0, zoom: 1 })}
        className="h-8 w-8 p-0 rounded-full"
        title="Reset View"
      >
        <RotateCcw size={16} />
      </Button>
      <Button
        variant={interactionMode === 'select' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => {
          setInteractionMode('select');
          console.log('Switched to Select Mode');
        }}
        className="h-8 w-8 p-0 rounded-full"
        title="Select Mode"
      >
        <MousePointer size={16} />
      </Button>
      <Button
        variant={interactionMode === 'pan' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => {
          setInteractionMode('pan');
          console.log('Switched to Pan Mode');
        }}
        className="h-8 w-8 p-0 rounded-full"
        title="Pan Mode"
      >
        <Hand size={16} />
      </Button>
    </div>
  )
}

// Selection Info Panel
const SelectionInfo: React.FC = () => {
  const selectedNodes = useFlowStore(state => state.selectedNodes)
  const selectedEdges = useFlowStore(state => state.selectedEdges)

  if (selectedNodes.length === 0 && selectedEdges.length === 0) {
    return null
  }

  return (
    <Panel position="top-right" className="mt-4 mr-4">
      <Card className="px-3 py-2 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
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

const WorkflowCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [contextMenu, setContextMenu] = React.useState<{
    x: number
    y: number
    nodeId?: string
    edgeId?: string
    nodeData?: NodeData
    edgeData?: EdgeData
  } | null>(null)

  // Memoize nodeTypes to prevent recreation
  const memoizedNodeTypes = React.useMemo(() => nodeTypes, []);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNodes,
    setSelectedEdges,
    setInstance,
    interactionMode
  } = useFlowStore(
    useShallow((state: FlowState) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      addNode: state.addNode,
      setSelectedNodes: state.setSelectedNodes,
      setSelectedEdges: state.setSelectedEdges,
      setInstance: state.setInstance,
      interactionMode: state.interactionMode
    }))
  );

  // Debug logging
  console.log('WorkflowCanvas render - nodes:', nodes);
  console.log('WorkflowCanvas render - edges:', edges);
  console.log('WorkflowCanvas render - memoizedNodeTypes:', memoizedNodeTypes);
  console.log('WorkflowCanvas render - nodeTypes keys:', Object.keys(memoizedNodeTypes));
  console.log('Interaction Mode:', interactionMode, 'panOnDrag:', interactionMode === 'pan', 'nodesDraggable:', interactionMode === 'select');

  // Drag and drop handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowInstance = useFlowStore.getState().instance;
      if (!reactFlowWrapper.current || !reactFlowInstance) {
        console.log('onDrop - missing reactFlowWrapper or instance');
        return;
      }

      const type = event.dataTransfer.getData('application/reactflow');
      console.log('onDrop - received type:', type);
      if (!type) {
        console.log('onDrop - no type found in dataTransfer');
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      console.log('onDrop - adding node with type:', type, 'at position:', position);
      addNode(type, position);
    },
    [addNode]
  );

  // Selection handlers
  const onSelectionChange = useCallback(
    ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
      console.log('onSelectionChange - selected nodes:', nodes, 'selected edges:', edges);
      setSelectedNodes(nodes as Node<NodeData>[]);
      setSelectedEdges(edges);
    },
    [setSelectedNodes, setSelectedEdges]
  );

  // Node and edge deletion handlers
  const onNodesDelete: OnNodesDelete = useCallback((nodes) => {
    nodes.forEach(node => {
      useFlowStore.getState().deleteNode(node.id);
    });
  }, []);

  const onEdgesDelete: OnEdgesDelete = useCallback((edges) => {
    edges.forEach(edge => {
      useFlowStore.getState().deleteEdge(edge.id);
    });
  }, []);

  // Context menu handlers
  const onNodeContextMenu: NodeMouseHandler = useCallback(
    (event, node) => {
      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
        nodeData: node.data as NodeData
      });
    },
    []
  );

  const onEdgeContextMenu: EdgeMouseHandler = useCallback(
    (event, edge) => {
      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        edgeId: edge.id,
        edgeData: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type,
          sourceHandle: edge.sourceHandle || undefined,
          targetHandle: edge.targetHandle || undefined,
          data: edge.data
        }
      });
    },
    []
  );

  const onPaneContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      event.preventDefault();
      setContextMenu(null);
    },
    []
  );

  // Close context menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };

    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  console.log('WorkflowCanvas is rendering');
  return (
    <div ref={reactFlowWrapper} className="w-full h-full relative">
      {/* Debug info - moved to top right */}
      <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded shadow text-xs border border-slate-200">
        <div>Nodes: {nodes.length}, Edges: {edges.length}</div>
        <div className="text-[10px] text-slate-500 mt-1">
          Types: {Object.keys(memoizedNodeTypes).join(', ')}
        </div>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance) => {
          setInstance(instance);
          console.log('ReactFlow instance initialized:', instance);
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneContextMenu={(event) => {
          console.log('onPaneContextMenu fired');
          setContextMenu(null);
        }}
        onSelectionChange={onSelectionChange}
        onNodeClick={(event, node) => console.log('onNodeClick fired for node:', node.id)}
        onPaneClick={(event) => console.log('onPaneClick fired')}
        nodeTypes={memoizedNodeTypes}
        attributionPosition="bottom-left"
        className="bg-gradient-to-br from-slate-50 to-slate-100"
        style={{ cursor: interactionMode === 'pan' ? 'grab' : 'default' }}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
        minZoom={0.1}
        maxZoom={4}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnScroll={interactionMode === 'pan'}
        panOnDrag={interactionMode === 'pan'}
        nodeDragThreshold={5}
        zoomOnDoubleClick={interactionMode === 'pan'}
        preventScrolling={true}
        nodesDraggable={interactionMode === 'select'}
        nodesConnectable={interactionMode === 'select'}
        elementsSelectable={interactionMode === 'select'}
        selectNodesOnDrag={false}
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
          nodeColor={(node: Node<NodeData>) => {
            const status = (node.data as NodeData)?.status;
            switch (status) {
              case 'completed': return '#10b981';
              case 'running': return '#3b82f6';
              case 'failed': return '#ef4444';
              default: return '#64748b';
            }
          }}
          nodeStrokeWidth={2}
          zoomable
          pannable
          className="border border-slate-200 rounded-lg shadow-lg bg-white/80 backdrop-blur-sm"
          style={{
            width: 200,
            height: 150,
            position: 'absolute',
            top: 10,
            left: 10,
          }}
        />
        <CustomControls />
        <SelectionInfo />
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
  );
}

export const WorkflowCanvasProvider: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas />
    </ReactFlowProvider>
  );
}; 