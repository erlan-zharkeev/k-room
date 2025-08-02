import './style.scss'
import { useDispatch } from 'react-redux'

import { updateMessageInputData, useChatRooms } from 'src/entities/chat-room'

import { AppDropdown, AppText, AppButton } from 'src/shared/ui'
import { stopPropagation } from 'src/shared/utils'

export const MessageWithBindDataModalMenu = () => {
  const { messageInputData } = useChatRooms()
  const { imageCompression } = messageInputData
  const dispatch = useDispatch()

  const items = [
    {
      label: (
        <>
          <AppText>{imageCompression ? "Don't compress" : 'Compress'} image</AppText>
        </>
      ),
      handler: (evt: unknown) => {
        dispatch(updateMessageInputData({ imageCompression: !imageCompression }))
        stopPropagation(evt)
      }
    }
  ]

  return (
    <AppDropdown
      additionalClassName="message-with-bind-data-modal-menu"
      items={items.map((item, idx) => ({
        label: item.label,
        type: 'item',
        onClick: item.handler,
        key: idx
      }))}
    >
      <AppButton prefixIconName="three-dots" borderless />
    </AppDropdown>
  )
}
