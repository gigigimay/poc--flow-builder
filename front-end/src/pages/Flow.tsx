import { nanoid } from 'nanoid'
import { useState, useCallback, useLayoutEffect } from 'react'
import ReactFlow, {
  Node,
  MiniMap,
  Controls,
  Background,
  ReactFlowInstance,
  DefaultEdgeOptions,
  ConnectionLineType,
} from 'react-flow-renderer'
import { useDispatch } from 'react-redux'
import { useSelector } from 'store/store'
import {
  onConnect,
  onEdgesChange,
  onNodesChange,
  onUpdateEdge,
  setActiveFlow,
  setEdges,
  setNodes,
  updateActiveFlow,
  updateFlow,
} from '../store/flowSlice'
import { nodeTypes, nodeTypeList } from '../nodeTypes'
import { useNavigate, useParams } from 'react-router-dom'
import { FlowConfig } from 'types/flow'
import { ConnectionLine } from 'components/ConnectionLine'
import classNames from 'classnames'

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
const randomDivisibleBy5 = (max) => randomInteger(1, max) * 5

const STROKE = 'rgb(31, 41, 55)'
const edgeOptions: DefaultEdgeOptions = {
  animated: true,
  type: ConnectionLineType.Bezier,
}

// const edgeTypes = {
//   floating:
// }

function Flow() {
  const { flowId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const currentFlow = useSelector(
    (state) => state.flow.activeFlow,
  ) as FlowConfig | null

  const nodes = currentFlow?.nodes
  const edges = currentFlow?.edges
  const name = currentFlow?.name || ''
  const type = currentFlow?.type || ''

  const handleNodesChange = (c) => dispatch(onNodesChange(c))
  const handleEdgesChange = (c) => dispatch(onEdgesChange(c))
  const [instance, setInstance] = useState<ReactFlowInstance>()

  const onClickAddNode = useCallback(
    (node: Partial<Node>) => () => {
      const id = nanoid(8)
      const newNode = {
        id,
        position: {
          x: randomDivisibleBy5(100),
          y: randomDivisibleBy5(100),
        },
        data: {},
        ...node,
      }
      instance.addNodes(newNode)
    },
    [instance],
  )

  const onDelete = useCallback(() => {
    const selectedNodes = nodes.filter((n) => n.selected)
    const newEdges = edges.filter((e) =>
      selectedNodes.every((n) => n.id !== e.target && n.id !== e.source),
    )
    dispatch(setNodes(nodes.filter((n) => !n.selected)))
    dispatch(setEdges(newEdges))
  }, [nodes, edges, dispatch])

  const handleConnect = useCallback(
    (connection) => dispatch(onConnect(connection)),
    [dispatch],
  )

  const onBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  const onSave = useCallback(() => {
    dispatch(updateFlow({ id: flowId, value: { type, name, nodes, edges } }))
    navigate('/')
  }, [dispatch, navigate, flowId, nodes, edges, type, name])

  useLayoutEffect(() => {
    dispatch(setActiveFlow(flowId))
    return () => {
      dispatch(setActiveFlow(undefined))
    }
  }, [flowId, dispatch])

  const topControls = (
    <div className="flex absolute inset-x-0 top-0 z-10 items-baseline py-2 px-4 m-4 space-x-4 bg-white rounded-lg shadow-lg">
      <div>
        <label htmlFor="flow-name" className="font-bold">
          Flow name:
        </label>
        <input
          id="flow-name"
          value={name}
          className="ml-2 w-48 input"
          onChange={(e) => dispatch(updateActiveFlow({ name: e.target.value }))}
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="flow-type" className="font-bold">
          Flow type:
        </label>
        <select
          name="flow-type"
          id="flow-type"
          value={type}
          className="ml-2"
          onChange={(e) => dispatch(updateActiveFlow({ type: e.target.value }))}
        >
          <option value="normal">normal</option>
          <option value="fallback">fallback</option>
        </select>
      </div>
      <div className="flex-1" />
      <button onClick={onBack} className="button">
        Back
      </button>
      <button onClick={onSave} className="button button-primary">
        Save
      </button>
    </div>
  )

  const bottomControls = (
    <div className="flex absolute inset-x-0 bottom-0 z-10 items-baseline py-2 px-4 m-4 space-x-4 bg-white rounded-lg shadow-lg">
      <button onClick={() => dispatch(setEdges([]))} className="button">
        Clear edges
      </button>
      <button onClick={onDelete} className="button">
        Delete selection
      </button>
      <div className="flex-1">
        <div className="flex justify-end items-baseline space-x-4">
          <div>Add node:</div>
          {nodeTypeList.map((item) => (
            <button
              key={item.type}
              onClick={onClickAddNode(item.initialConfig)}
              className={classNames('button', item.buttonClassNames)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col w-full" style={{ height: '100vh' }}>
      <div className="flex-1">
        <ReactFlow
          snapToGrid
          className="validationflow"
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          // edgeTypes={edgeTypes}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onEdgeUpdate={(oldEdge, newConnection) =>
            dispatch(onUpdateEdge({ oldEdge, newConnection }))
          }
          onConnect={handleConnect}
          onInit={(instance) => setInstance(instance)}
          fitView
          defaultEdgeOptions={edgeOptions}
          connectionLineType={ConnectionLineType.Bezier}
          connectionLineStyle={{ stroke: STROKE }}
          connectionLineComponent={ConnectionLine}
        >
          <MiniMap style={{ bottom: 80 }} />
          <Controls
            className="bg-white rounded-lg shadow-lg"
            style={{ bottom: 80 }}
          />
          <Background />
          {topControls}
          {bottomControls}
        </ReactFlow>
      </div>
    </div>
  )
}

export default Flow
