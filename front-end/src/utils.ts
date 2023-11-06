import { Node, Edge } from 'react-flow-renderer'

export const transformStateToConfig = (nodes: Node[], edges: Edge[]) => ({
  nodes: nodes.map(({ id, type, data }) => ({ id, type, data })),
  edges: edges.map(
    ({
      id,
      source,
      sourceHandle,
      sourceNode,
      target,
      targetHandle,
      targetNode,
    }) => ({
      id,
      source,
      sourceHandle,
      sourceNode,
      target,
      targetHandle,
      targetNode,
    }),
  ),
})
