import { createSlice } from '@reduxjs/toolkit'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  updateEdge,
  Connection,
  EdgeChange,
  NodeChange,
} from 'react-flow-renderer'

import { FlowConfig } from 'types/flow'
import initialFlows from '../flows/all.json'

export interface FlowState {
  activeFlow: FlowConfig | null
  flows: FlowConfig[]
}

const initialState: FlowState = {
  activeFlow: null,
  flows: initialFlows,
}

export const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    onNodesChange: (state, { payload }) => {
      if (!state.activeFlow) return
      const changes: NodeChange[] = payload
      state.activeFlow.nodes = applyNodeChanges(changes, state.activeFlow.nodes)
    },
    onEdgesChange: (state, { payload }) => {
      if (!state.activeFlow) return
      const changes: EdgeChange[] = payload
      state.activeFlow.edges = applyEdgeChanges(changes, state.activeFlow.edges)
    },
    onUpdateEdge: (state, { payload }) => {
      if (!state.activeFlow) return
      const { oldEdge, newConnection } = payload
      state.activeFlow.edges = updateEdge(
        oldEdge,
        newConnection,
        state.activeFlow.edges,
      )
    },
    onConnect: (state, { payload }) => {
      if (!state.activeFlow) return
      const connection: Connection = payload
      state.activeFlow.edges = state.activeFlow.edges.filter(
        (edge) =>
          !(
            edge.source === connection.source &&
            edge.sourceHandle === connection.sourceHandle
          ),
      )
      state.activeFlow.edges = addEdge(connection, state.activeFlow.edges)
    },
    setNodes: (state, { payload }) => {
      if (!state.activeFlow) return
      state.activeFlow.nodes = payload
    },
    setEdges: (state, { payload }) => {
      if (!state.activeFlow) return
      state.activeFlow.edges = payload
    },
    setNodeData: (state, { payload }) => {
      if (!state.activeFlow) return
      const { id, data } = payload
      const node = state.activeFlow.nodes.find((n) => n.id === id)
      if (node) {
        node.data = data
      }
    },
    deleteFlow: (state, { payload }) => {
      const id = payload
      state.flows = state.flows.filter((f) => f.id !== id)
    },
    updateFlow: (state, { payload }) => {
      const { id, value } = payload
      const index = state.flows.findIndex((f) => f.id === id)
      if (index !== -1) {
        state.flows[index] = {
          ...state.flows[index],
          ...value,
        }
      }
    },
    createFlow: (state, { payload }) => {
      state.flows.push(payload)
    },
    setActiveFlow: (state, { payload }) => {
      const id = payload
      state.activeFlow = id ? state.flows.find((f) => f.id === id) : null
    },
    updateActiveFlow: (state, { payload }) => {
      state.activeFlow = {
        ...state.activeFlow,
        ...payload,
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  onNodesChange,
  onEdgesChange,
  onUpdateEdge,
  onConnect,
  setNodes,
  setEdges,
  setNodeData,
  deleteFlow,
  updateFlow,
  createFlow,
  setActiveFlow,
  updateActiveFlow,
} = flowSlice.actions

export default flowSlice.reducer
