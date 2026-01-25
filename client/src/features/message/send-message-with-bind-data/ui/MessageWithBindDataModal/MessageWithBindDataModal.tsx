import './style.scss'

import { useDispatch } from 'react-redux'

import { MessageInput } from 'src/features/message'

import { removeImageByNameFromMessageInputData, useSystem } from 'src/entities/system'

import { AppImagePreview } from 'src/shared/ui'

export const MessageWithBindDataModal = () => {
  const { messageInputData } = useSystem()
  const { images } = messageInputData
  const dispatch = useDispatch()

  return (
    <div className="message-with-bind-data-modal">
      <AppImagePreview images={images} removeImage={(name) => dispatch(removeImageByNameFromMessageInputData(name))} />
      <MessageInput />
    </div>
  )
}
