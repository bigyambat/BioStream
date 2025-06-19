import { 
  Node, 
  Edge, 
  XYPosition,
  OnNodesChange,
  OnEdgesChange,
  OnConnect
} from '@xyflow/react';

export interface Position {
  x: number;
  y: number;
}

export type NodeType = 'r-script' | 'data-source' | 'transform' | 'visualization' | 'control';
export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed';
export type ExecutionTarget = 'local' | 'hpc';

export interface NodeData {
  label: string;
  description?: string;
  icon?: string;
  type: NodeType;
  status?: ExecutionStatus;
  executionTarget?: ExecutionTarget;
  code?: string;
  params?: Record<string, string | number | boolean>;
  [key: string]: unknown;
}

export interface NodeTemplate {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  category: string;
  defaultData?: Partial<NodeData>;
  defaultCode?: string;
  defaultParams?: Record<string, string | number | boolean>;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  type?: string;
  sourceHandle?: string;
  targetHandle?: string;
  data?: Record<string, unknown>;
}

export interface ExecutionResult {
  output: string;
  error?: string;
  startTime: string;
  endTime: string;
  status: ExecutionStatus;
}

export interface WorkflowProject {
  id: string;
  name: string;
  description: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
    author: string;
  };
}

export type RFState = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (type: string, position: XYPosition) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
}; 