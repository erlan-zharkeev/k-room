import { useState, useEffect } from 'react'
import { Rnd } from 'react-rnd'
import { useTypedSelector } from 'src/hooks'
import { CallModalBody } from './components/CallModalBody/CallModalBody'

export interface ModalOptions {
  width: number
  height: number
  x: number
  y: number
}

const initialSize = {
  width: 300,
  height: 450,
  minWidth: 300,
  minHeight: 450
}

export const CallModal = () => {
  const viewPortWidth = useTypedSelector((state) => state.system.viewPort.width)
  const viewPortHeight = useTypedSelector((state) => state.system.viewPort.height)
  const { isMinified, showCallModal } = useTypedSelector((state) => state.calls)
  const [modalWidth, setModalWidth] = useState(initialSize.width)
  const [modalHeight, setModalHeight] = useState(initialSize.height)
  const initialPosition = {
    x: (viewPortWidth - initialSize.width) / 2,
    y: (viewPortHeight - initialSize.height) / 2
  }
  const [modalPositionX, setModalPositionX] = useState(initialPosition.x)
  const [modalPositionY, setModalPositionY] = useState(initialPosition.y)

  useEffect(() => {
    setModalPositionX(initialPosition.x)
    setModalPositionY(initialPosition.y)
  }, [showCallModal])

  const setModalOptions = ({ width, height, x, y }: ModalOptions) => {
    setModalWidth(width)
    setModalHeight(height)
    setModalPositionX(x)
    setModalPositionY(y)
  }

  const toggleExpandModal = () => {
    const isFullyOpened = viewPortWidth === modalWidth && viewPortHeight === modalHeight
    const updatedOptions = {
      width: isFullyOpened ? initialSize.width : viewPortWidth,
      height: isFullyOpened ? initialSize.height : viewPortHeight,
      x: isFullyOpened ? initialPosition.x : 0,
      y: isFullyOpened ? initialPosition.y : 0
    }
    setModalOptions(updatedOptions)
  }

  return (
    <div
      className={`draggable-resizable-modal ${
        showCallModal && !isMinified ? '' : 'draggable-resizable-modal--collapse'
      }`}
    >
      <Rnd
        size={{ width: modalWidth, height: modalHeight }}
        minWidth={initialSize.minWidth}
        minHeight={initialSize.minHeight}
        position={{ x: modalPositionX, y: modalPositionY }}
        onDragStop={(_e, d) => {
          setModalPositionX(d.x)
          setModalPositionY(d.y)
        }}
        onResizeStop={(_e, _direction, ref, _delta, position) => {
          setModalOptions({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            x: position.x,
            y: position.y
          })
        }}
      >
        <CallModalBody toggleExpandModal={toggleExpandModal} />
      </Rnd>
    </div>
  )
}
