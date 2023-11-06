import React from 'react'
import { Handle, Position, NodeProps } from 'react-flow-renderer'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import { setNodeData } from 'store/flowSlice'
import { nanoid } from 'nanoid'

interface ConditionBoxProps {
  id: string
  children: React.ReactNode
}

const ConditionBox: React.FC<ConditionBoxProps> = ({ children, id }) => (
  <div className="relative my-2 rounded-lg">
    {children}
    <Handle type="source" position={Position.Right} id={id} />
  </div>
)

const IdleNode: React.FC<NodeProps> = ({ id, selected, data }) => {
  const { type, label = 'Wait for message', conditions = [] } = data
  const dispatch = useDispatch()
  const onInputChange = (index: number) => (e) => {
    const newConditions = [...conditions]
    const prevItem = newConditions[index]
    newConditions[index] = {
      ...prevItem,
      message: e.target.value || '',
    }
    dispatch(setNodeData({ id, data: { conditions: newConditions } }))
  }

  const onClickAddCondition = () => {
    const newItem = { id: nanoid(), message: '' }
    const newConditions = [...conditions, newItem]
    dispatch(setNodeData({ id, data: { conditions: newConditions } }))
  }
  return (
    <>
      {type !== 'start' && id !== 'start' && (
        <Handle type="target" position={Position.Top} />
      )}
      <div
        className={classNames(
          'p-3 bg-red-100 border-2 border-red-300 rounded-lg',
          {
            'border-gray-400': selected,
          },
        )}
      >
        <div className="text-sm italic">{id}</div>
        <div>{label}</div>
        {conditions.map(({ id, message = '' }, index) => (
          <ConditionBox id={id} key={id}>
            <input
              className="py-2 px-4 w-full rounded-md border-2 border-red-200 focus:border-red-300 outline-none"
              id={id}
              name="text"
              placeholder="(any)"
              onChange={onInputChange(index)}
              value={message}
            />
          </ConditionBox>
        ))}
        {type !== 'end' && id !== 'end' && (
          <div className="my-2 text-center">
            <button
              className="hover: py-2 px-3 font-bold text-red-900 bg-red-200 hover:bg-red-300 rounded-lg"
              onClick={onClickAddCondition}
            >
              Add Condition
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default IdleNode
