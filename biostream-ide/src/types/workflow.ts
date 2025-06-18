export interface Position {
  x: number
  y: number
}

export interface NodeData {
  id: string
  type: NodeType
  label: string
  position?: Position
  code?: string
  params?: Record<string, unknown>
  executionTarget?: ExecutionTarget
  status: ExecutionStatus
  error?: string
  logs?: string[]
  resources?: ResourceSpec
  metadata?: Record<string, unknown>
}

export interface EdgeData {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  type: EdgeType
  data?: Record<string, unknown>
}

export interface WorkflowProject {
  id: string
  name: string
  description?: string
  nodes: NodeData[]
  edges: EdgeData[]
  metadata: {
    createdAt: string
    updatedAt: string
    version: string
    author?: string
  }
}

export interface ResourceSpec {
  cpu?: number
  memory?: number
  time?: string
  gpu?: number
}

export type NodeType = 
  | 'r-script'
  | 'data-source'
  | 'transform'
  | 'visualization'
  | 'control'

export type EdgeType = 
  | 'data-flow'
  | 'control-flow'

export type ExecutionTarget = 
  | 'local'
  | 'hpc'

export type ExecutionStatus = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cached'

export interface NodeTemplate {
  type: NodeType
  label: string
  description: string
  icon: string
  defaultCode?: string
  defaultParams?: Record<string, unknown>
  category: string
}

export interface ExecutionResult {
  nodeId: string
  status: ExecutionStatus
  output?: unknown
  error?: string
  logs: string[]
  executionTime?: number
  resources?: ResourceSpec
} 