import { Edge, Node } from 'react-flow-renderer'

export enum FlowType {
  normal = 'normal',
  fallback = 'fallback',
}

export interface FlowConfig {
  id: string
  name: string
  type: string
  priority: number
  nodes: Node[]
  edges: Edge[]
}
