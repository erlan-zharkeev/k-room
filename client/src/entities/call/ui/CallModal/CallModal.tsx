import './style.scss'
import { useState, useEffect } from 'react'

import { Rnd } from 'react-rnd'

import { useViewport } from 'src/entities/system'

import { useTypedSelector } from 'src/shared/lib'
import { createClassNameWithModifiers } from 'src/shared/utils'

import { CallModalBody } from '..'
import type { IModalOptions } from '../..'
import { CALL_MODAL_INITIAL_SIZE } from '../..'

export const CallModal = () => {
  const { viewPort } = useViewport()

  const { isMinified, showCallModal } = useTypedSelector((state) => state.calls)
  const className = createClassNameWithModifiers({
    rootClass: 'draggable-resizable-modal',
    modifiers: [!(showCallModal && !isMinified) && 'collapse']
  })

  const [modalWidth, setModalWidth] = useState(CALL_MODAL_INITIAL_SIZE.width)
  const [modalHeight, setModalHeight] = useState(CALL_MODAL_INITIAL_SIZE.height)
  const initialPosition = {
    x: (viewPort.width - CALL_MODAL_INITIAL_SIZE.width) / 2,
    y: (viewPort.height - CALL_MODAL_INITIAL_SIZE.height) / 2
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
      width: isFullyOpened ? CALL_MODAL_INITIAL_SIZE.width : viewPort.width,
      height: isFullyOpened ? CALL_MODAL_INITIAL_SIZE.height : viewPort.height,
      x: isFullyOpened ? initialPosition.x : 0,
      y: isFullyOpened ? initialPosition.y : 0
    }
    setModalOptions(updatedOptions)
  }

  return (
    <div className={className}>
      <Rnd
        size={{ width: modalWidth, height: modalHeight }}
        minWidth={CALL_MODAL_INITIAL_SIZE.minWidth}
        minHeight={CALL_MODAL_INITIAL_SIZE.minHeight}
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
