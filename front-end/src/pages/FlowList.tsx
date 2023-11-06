import * as fp from 'lodash/fp'
import { nanoid } from 'nanoid'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { createFlow, deleteFlow, updateFlow } from 'store/flowSlice'
import { useSelector } from 'store/store'
import { FlowConfig } from 'types/flow'

const createNewFlowConfig = (): FlowConfig => {
  return {
    id: nanoid(8),
    name: 'untitled',
    type: 'normal',
    priority: 1,
    nodes: [
      {
        id: 'start',
        position: {
          x: -155,
          y: 130,
        },
        data: {
          conditions: [
            {
              id: 'any',
            },
          ],
        },
        type: 'idle',
        width: 239,
        height: 180,
        selected: false,
        positionAbsolute: {
          x: -155,
          y: 130,
        },
        dragging: false,
      },
      {
        id: 'end',
        type: 'idle',
        data: {
          type: 'end',
          label: 'End of flow',
        },
        position: {
          x: 1319.0181760642424,
          y: 530.859539637864,
        },
        width: 162,
        height: 128,
        selected: false,
        positionAbsolute: {
          x: 1319.0181760642424,
          y: 530.859539637864,
        },
        dragging: false,
      },
    ],
    edges: [],
  }
}

const FlowList: React.FC = () => {
  const flows = useSelector((state) => state.flow.flows || []) as FlowConfig[]
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onCreate = useCallback(() => {
    const newFlow = createNewFlowConfig()
    dispatch(createFlow(newFlow))
    navigate(`/${newFlow.id}`)
  }, [dispatch, navigate])

  const onDelete = useCallback((id) => dispatch(deleteFlow(id)), [dispatch])
  const onChangePriority = useCallback(
    (id, priority) => dispatch(updateFlow({ id, value: { priority } })),
    [dispatch],
  )

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(flows, null, 2))
    console.log('Copied!', flows)
  }, [flows])

  return (
    <div className="container py-12 px-10 m-auto">
      <h1 className="mt-12 mb-4 text-4xl font-bold text-gray-900">
        Flow Builder
      </h1>
      <div className="flex items-baseline mb-4 space-x-4">
        <button onClick={onCreate} className="button button-primary">
          + New Flow
        </button>
        <button onClick={onCopy} className="button button-primary-outline">
          Copy Config
        </button>
      </div>
      <h1 className="mt-6 mb-4 text-2xl font-bold text-gray-900">Flows</h1>
      <div>
        <div className="flex py-2 px-4 mb-4 space-x-4 font-medium">
          <div className="flex-1">name</div>
          <div className="flex-1">entry keywords</div>
          <div className="w-16 text-center">type</div>
          <div className="w-16 text-center">priority</div>
          <div style={{ flex: 2 }}>Actions</div>
        </div>
        {fp.pipe(
          fp.sortBy([
            (f: FlowConfig) => (f.type === 'fallback' ? 2 : 1),
            fp.pipe(fp.get('priority'), fp.multiply(-1)),
          ]),
          fp.map((flow: FlowConfig) => (
            <div
              key={flow.id}
              className="flex items-baseline py-3 px-4 mb-4 space-x-4 bg-white rounded-xl shadow-lg"
            >
              <div className="flex-1">{flow.name}</div>
              <div className="flex-1">
                {flow.nodes
                  .find((n) => n.id === 'start')
                  ?.data.conditions?.map((c) => c.message)
                  .join(', ')}
              </div>
              <div className="w-16 text-center">{flow.type}</div>
              <div className="w-16 text-center">{flow.priority}</div>
              <div className="flex space-x-4" style={{ flex: 2 }}>
                <Link to={`/${flow.id}`}>
                  <button className="button button-primary">Edit</button>
                </Link>
                <button
                  onClick={() => onDelete(flow.id)}
                  className="text-white bg-red-400 hover:bg-red-300 button"
                >
                  Delete
                </button>
                <button
                  onClick={() => onChangePriority(flow.id, flow.priority + 1)}
                  className="button"
                >
                  +1
                </button>
                <button
                  onClick={() => onChangePriority(flow.id, flow.priority - 1)}
                  className="button"
                >
                  -1
                </button>
              </div>
            </div>
          )),
        )(flows)}
      </div>
    </div>
  )
}

export default FlowList
