import { useCallback } from 'react'
import { Handle, Position, NodeProps } from 'react-flow-renderer'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import { setNodeData } from 'store/flowSlice'

const CheckTextMessageNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const { label = 'Send message:', value } = data
  const dispatch = useDispatch()
  const onChange = useCallback(
    (evt) => {
      dispatch(setNodeData({ id, data: { value: evt.target.value || '' } }))
    },
    [dispatch, id],
  )

  const isValidConnection = (connection) => {
    // console.log('isValidConnection connection', connection)
    return true
  }

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div
        className={classNames(
          'border-2 border-teal-200 p-2 bg-teal-100 rounded-md w-60',
          {
            'border-teal-800': selected,
          },
        )}
      >
        <div className="text-sm italic">{id}</div>
        <div>
          <label htmlFor={id}>{label}</label>
        </div>
        <input
          className="mt-2 border-teal-200 focus:border-teal-300 input"
          id={id}
          name="text"
          onChange={onChange}
          value={value}
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isValidConnection={isValidConnection}
      />
    </>
  )
}

export default CheckTextMessageNode
