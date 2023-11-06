import { useCallback } from 'react'
import { Handle, Position, NodeProps } from 'react-flow-renderer'
import { useDispatch } from 'react-redux'
import { setNodeData } from 'store/flowSlice'

const positionsOrder = [
  Position.Left,
  Position.Top,
  Position.Right,
  Position.Bottom,
]

const getNextPosition = (currentValue: string) => {
  const currentSourceHandleIndex =
    positionsOrder.findIndex((v) => v === currentValue) ?? 0
  const newSourceHandleIndex = (currentSourceHandleIndex + 1) % 4
  return positionsOrder[newSourceHandleIndex]
}

const ConnectorNode: React.FC<NodeProps> = ({ data, id }) => {
  const { sourceHandlePosition = 'right', targetHandlePosition = 'left' } = data
  const dispatch = useDispatch()
  const onClick = useCallback(() => {
    dispatch(
      setNodeData({
        id,
        data: {
          sourceHandlePosition: getNextPosition(sourceHandlePosition),
          targetHandlePosition: getNextPosition(targetHandlePosition),
        },
      }),
    )
  }, [dispatch, id, sourceHandlePosition, targetHandlePosition])

  return (
    <>
      <Handle type="target" position={targetHandlePosition} />
      <Handle type="source" position={sourceHandlePosition} />
      <div className="w-5 h-5 bg-white" onClick={onClick} />
    </>
  )
}

export default ConnectorNode
