import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NodeData, EdgeData, WorkflowProject, ExecutionStatus, Position, ExecutionResult } from '@/types/workflow'

interface WorkflowState {
  project: WorkflowProject | null
  selectedNodes: string[]
  selectedEdges: string[]
  isExecuting: boolean
  executionResults: Record<string, ExecutionResult>
  clipboard: {
    nodes: NodeData[]
    edges: EdgeData[]
  }
  history: {
    past: WorkflowProject[]
    future: WorkflowProject[]
  }
}

// Default project for initialization
const defaultProject: WorkflowProject = {
  id: 'default-project',
  name: 'Untitled Workflow',
  description: 'A new R workflow project',
  nodes: [],
  edges: [],
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: '1.0.0',
    author: 'BioStream IDE'
  }
}

const initialState: WorkflowState = {
  project: defaultProject,
  selectedNodes: [],
  selectedEdges: [],
  isExecuting: false,
  executionResults: {},
  clipboard: {
    nodes: [],
    edges: []
  },
  history: {
    past: [],
    future: []
  }
}

export const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setProject: (state, action: PayloadAction<WorkflowProject>) => {
      state.project = action.payload
    },
    
    addNode: (state, action: PayloadAction<NodeData>) => {
      if (state.project) {
        state.project.nodes.push(action.payload)
        state.project.metadata.updatedAt = new Date().toISOString()
      }
    },
    
    updateNode: (state, action: PayloadAction<{ id: string; updates: Partial<NodeData> }>) => {
      if (state.project) {
        const nodeIndex = state.project.nodes.findIndex(node => node.id === action.payload.id)
        if (nodeIndex !== -1) {
          state.project.nodes[nodeIndex] = { ...state.project.nodes[nodeIndex], ...action.payload.updates }
          state.project.metadata.updatedAt = new Date().toISOString()
        }
      }
    },
    
    removeNode: (state, action: PayloadAction<string>) => {
      if (state.project) {
        state.project.nodes = state.project.nodes.filter(node => node.id !== action.payload)
        state.project.edges = state.project.edges.filter(
          edge => edge.source !== action.payload && edge.target !== action.payload
        )
        state.project.metadata.updatedAt = new Date().toISOString()
      }
    },
    
    addEdge: (state, action: PayloadAction<EdgeData>) => {
      if (state.project) {
        state.project.edges.push(action.payload)
        state.project.metadata.updatedAt = new Date().toISOString()
      }
    },
    
    removeEdge: (state, action: PayloadAction<string>) => {
      if (state.project) {
        state.project.edges = state.project.edges.filter(edge => edge.id !== action.payload)
        state.project.metadata.updatedAt = new Date().toISOString()
      }
    },
    
    setSelectedNodes: (state, action: PayloadAction<string[]>) => {
      state.selectedNodes = action.payload
    },
    
    setSelectedEdges: (state, action: PayloadAction<string[]>) => {
      state.selectedEdges = action.payload
    },
    
    setExecutionStatus: (state, action: PayloadAction<{ nodeId: string; status: ExecutionStatus }>) => {
      if (state.project) {
        const node = state.project.nodes.find(n => n.id === action.payload.nodeId)
        if (node) {
          node.status = action.payload.status
        }
      }
    },
    
    setExecutionResults: (state, action: PayloadAction<Record<string, ExecutionResult>>) => {
      state.executionResults = { ...state.executionResults, ...action.payload }
    },
    
    setIsExecuting: (state, action: PayloadAction<boolean>) => {
      state.isExecuting = action.payload
    },
    
    copyToClipboard: (state, action: PayloadAction<{ nodes: NodeData[]; edges: EdgeData[] }>) => {
      state.clipboard = action.payload
    },
    
    pasteFromClipboard: (state, action: PayloadAction<Position>) => {
      if (state.project && state.clipboard.nodes.length > 0) {
        const offset = action.payload
        const newNodes = state.clipboard.nodes.map(node => ({
          ...node,
          id: `${node.id}_${Date.now()}`,
          position: {
            x: (node.position?.x || 0) + offset.x,
            y: (node.position?.y || 0) + offset.y
          }
        }))
        
        const newEdges = state.clipboard.edges.map(edge => ({
          ...edge,
          id: `${edge.id}_${Date.now()}`,
          source: `${edge.source}_${Date.now()}`,
          target: `${edge.target}_${Date.now()}`
        }))
        
        state.project.nodes.push(...newNodes)
        state.project.edges.push(...newEdges)
        state.project.metadata.updatedAt = new Date().toISOString()
      }
    },
    
    saveToHistory: (state) => {
      if (state.project) {
        state.history.past.push(JSON.parse(JSON.stringify(state.project)))
        state.history.future = []
        // Keep only last 100 states
        if (state.history.past.length > 100) {
          state.history.past.shift()
        }
      }
    },
    
    undo: (state) => {
      if (state.history.past.length > 0) {
        const previousState = state.history.past.pop()
        if (previousState && state.project) {
          state.history.future.push(JSON.parse(JSON.stringify(state.project)))
          state.project = previousState
        }
      }
    },
    
    redo: (state) => {
      if (state.history.future.length > 0) {
        const nextState = state.history.future.pop()
        if (nextState && state.project) {
          state.history.past.push(JSON.parse(JSON.stringify(state.project)))
          state.project = nextState
        }
      }
    }
  }
})

export const {
  setProject,
  addNode,
  updateNode,
  removeNode,
  addEdge,
  removeEdge,
  setSelectedNodes,
  setSelectedEdges,
  setExecutionStatus,
  setExecutionResults,
  setIsExecuting,
  copyToClipboard,
  pasteFromClipboard,
  saveToHistory,
  undo,
  redo
} = workflowSlice.actions

export default workflowSlice.reducer 