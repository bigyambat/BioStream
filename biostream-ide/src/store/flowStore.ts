'use client';

import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  XYPosition,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowInstance,
  Viewport,
  MarkerType
} from '@xyflow/react';
import { NodeData, NodeType } from '@/types/workflow';

export interface FlowState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  zoom: number;
  selectedNodes: Node<NodeData>[];
  selectedEdges: Edge[];
  instance: ReactFlowInstance | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: string, position: XYPosition) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  setZoom: (zoom: number) => void;
  setSelectedNodes: (nodes: Node<NodeData>[]) => void;
  setSelectedEdges: (edges: Edge[]) => void;
  setInstance: (instance: ReactFlowInstance | null) => void;
  setViewport: (viewport: Viewport) => void;
}

const initialNodes: Node<NodeData>[] = [
  {
    id: 'test-node-1',
    type: 'r-script',
    position: { x: 250, y: 200 },
    data: {
      label: 'Test R Script',
      description: 'A test R script node',
      icon: '📊',
      type: 'r-script',
    },
  },
  {
    id: 'test-node-2',
    type: 'data-source',
    position: { x: 500, y: 200 },
    data: {
      label: 'Test Data Source',
      description: 'A test data source node',
      icon: '📁',
      type: 'data-source',
    },
  },
];
const initialEdges: Edge[] = [
  { 
    id: 'e-test-1-test-2', 
    source: 'test-node-1', 
    target: 'test-node-2', 
    markerEnd: { type: MarkerType.ArrowClosed } 
  }
];

export const useFlowStore = create<FlowState>((set, get) => {
  console.log('Initializing flowStore with initial nodes:', initialNodes);
  
  return {
    nodes: initialNodes,
    edges: initialEdges,
    zoom: 1,
    selectedNodes: [],
    selectedEdges: [],
    instance: null,

    onNodesChange: (changes: NodeChange[]) => {
      console.log('onNodesChange called with changes:', changes);
      set({
        nodes: applyNodeChanges(changes, get().nodes) as Node<NodeData>[],
      });
    },

    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },

    onConnect: (connection: Connection) => {
      set({
        edges: addEdge({ ...connection, markerEnd: { type: MarkerType.ArrowClosed } }, get().edges),
      });
    },

    addNode: (type: string, position: XYPosition) => {
      const newNodeId = `${type}-${Date.now()}`;
      const nodeData: NodeData = {
        label: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
        description: `A ${type.replace('-', ' ')} node`,
        icon: getNodeIcon(type),
        type: type as NodeType,
      };

      const newNode: Node<NodeData> = {
        id: newNodeId,
        type,
        position,
        data: nodeData,
        dragHandle: '.custom-drag-handle',
      };

      const { nodes, edges } = get();
      console.log('Auto-connecting. Current state:', { numNodes: nodes.length, numEdges: edges.length });
      let newEdge: Edge | null = null;

      // Auto-connect logic: find the most recent node that is a "leaf" (no outgoing connections)
      if (nodes.length > 0) {
        const sourceNode = [...nodes]
          .reverse()
          .find(node => !edges.some(edge => edge.source === node.id));
        
        if (sourceNode) {
          console.log('Found leaf node to connect from:', sourceNode.id);
          newEdge = {
            id: `e-${sourceNode.id}-${newNode.id}`,
            source: sourceNode.id,
            target: newNode.id,
            markerEnd: { type: MarkerType.ArrowClosed },
          };
          console.log('Creating new default edge:', newEdge);
        } else {
          console.log('No leaf node found. Not creating a new edge.');
        }
      }

      set((state) => ({
        nodes: [...state.nodes, newNode],
        edges: newEdge ? [...state.edges, newEdge] : state.edges,
      }));
      
      console.log('State after update:', { numNodes: get().nodes.length, numEdges: get().edges.length });
    },

    updateNodeData: (nodeId: string, data: Partial<NodeData>) => {
      set({
        nodes: get().nodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        ),
      });
    },

    deleteNode: (nodeId: string) => {
      set({
        nodes: get().nodes.filter((node) => node.id !== nodeId),
        edges: get().edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        ),
      });
    },

    deleteEdge: (edgeId: string) => {
      set({
        edges: get().edges.filter((edge) => edge.id !== edgeId),
      });
    },

    setZoom: (zoom: number) => {
      set({ zoom });
    },

    setSelectedNodes: (nodes: Node<NodeData>[]) => {
      set({ selectedNodes: nodes });
    },

    setSelectedEdges: (edges: Edge[]) => {
      set({ selectedEdges: edges });
    },

    setInstance: (instance: ReactFlowInstance | null) => {
      set({ instance });
    },

    setViewport: (viewport: Viewport) => {
      const instance = get().instance;
      if (instance) {
        instance.setViewport(viewport);
      }
    },
  };
});

function getNodeIcon(type: string): string {
  switch (type) {
    case 'r-script':
      return '📊';
    case 'data-source':
      return '📁';
    case 'transform':
      return '🔄';
    case 'visualization':
      return '📈';
    case 'control':
      return '🎮';
    default:
      return '📄';
  }
}