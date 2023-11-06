import React from 'react'
import { Node, NodeTypes } from 'react-flow-renderer'
import SendTextMessageNode from './nodes/SendMessageNode'
import IdleNode from './nodes/IdleNode'

export enum NodeType {
  sendMessage = 'sendMessage',
  idle = 'idle',
  connector = 'connector',
}

interface NodeTypeConfig {
  label: string
  type: NodeType
  component: React.FC
  initialConfig: Partial<Node>
  buttonClassNames?: string
}

export const nodeTypeList: NodeTypeConfig[] = [
  {
    type: NodeType.idle,
    label: 'Idle',
    component: IdleNode,
    initialConfig: {
      type: NodeType.idle,
      data: {
        conditions: [{ id: 'any' }],
      },
    },
    buttonClassNames: 'bg-red-100 border-2 border-red-300 hover:bg-red-200',
  },
  {
    type: NodeType.sendMessage,
    label: 'Send Message',
    component: SendTextMessageNode,
    initialConfig: { type: NodeType.sendMessage },
    buttonClassNames: 'bg-teal-100 border-2 border-teal-300 hover:bg-teal-200',
  },
]

export const nodeTypes: NodeTypes = nodeTypeList.reduce((result, curr) => {
  return { ...result, [curr.type]: curr.component }
}, {})
