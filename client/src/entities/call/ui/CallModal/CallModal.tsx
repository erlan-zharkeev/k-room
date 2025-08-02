import './style.scss'
import { useState, useEffect } from 'react'

import { Rnd } from 'react-rnd'

import { useViewport } from 'src/entities/system'

import { useTypedSelector } from 'src/shared/lib'

import type { IModalOptions } from '../../types'

import { CallModalBody } from './elements'

const initialSize = {
  width: 300,
  height: 450,
  minWidth: 300,
  minHeight: 450
}

export const CallModal = () => {
  const { viewPort } = useViewport()

  const { isMinified, showCallModal } = useTypedSelector((state) => state.calls)

  const [modalWidth, setModalWidth] = useState(initialSize.width)
  const [modalHeight, setModalHeight] = useState(initialSize.height)
  const initialPosition = {
    x: (viewPort.width - initialSize.width) / 2,
    y: (viewPort.height - initialSize.height) / 2
  }
  const [modalPositionX, setModalPositionX] = useState(initialPosition.x)
  const [modalPositionY, setModalPositionY] = useState(initialPosition.y)

  useEffect(() => {
    setModalPositionX(initialPosition.x)
    setModalPositionY(initialPosition.y)
  }, [showCallModal])

  const setModalOptions = ({ width, height, x, y }: IModalOptions) => {
    setModalWidth(width)
    setModalHeight(height)
    setModalPositionX(x)
    setModalPositionY(y)
  }

  const toggleExpandModal = () => {
    const isFullyOpened = viewPort.width === modalWidth && viewPort.height === modalHeight
    const updatedOptions = {
      width: isFullyOpened ? initialSize.width : viewPort.width,
      height: isFullyOpened ? initialSize.height : viewPort.height,
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
