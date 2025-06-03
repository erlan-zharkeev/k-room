import './style.scss'
import { useDispatch } from 'react-redux'

import { updateMessageInputData, useChatRooms } from 'src/entities/chat-room'

import { AppDropdown, AppText, AppButton } from 'src/shared/ui'

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
        const event = evt as React.MouseEvent<HTMLElement, MouseEvent>
        event.stopPropagation()
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
