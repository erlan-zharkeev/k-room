import './style.scss'

import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { MessageInput } from 'src/features/message'

import { removeImageInMessageInputDataByImageName, useChatRooms } from 'src/entities/chat-room'
import { closeModal } from 'src/entities/system'

import { AppImagePreview } from 'src/shared/ui'

export const MessageWithBindDataModal = () => {
  const { messageInputData } = useChatRooms()
  const { images } = messageInputData
  const dispatch = useDispatch()

  useEffect(() => {
    if (images.length === 0) {
      dispatch(closeModal())
    }
  }, [images])

  return (
    <div className="message-with-bind-data-modal">
      <AppImagePreview
        images={images}
        removeImage={(name) => dispatch(removeImageInMessageInputDataByImageName({ name }))}
      />
      <MessageInput />
    </div>
  )
}
