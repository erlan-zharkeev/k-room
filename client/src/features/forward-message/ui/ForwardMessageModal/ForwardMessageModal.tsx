import './style.scss'
import { useState } from 'react'

import { ShortChatList } from 'src/features/forward-message'
import { FORWARD_MESSAGE_MODAL_I18N, IForwardMessageModalProps } from 'src/features/forward-message'
import { useChatRoomSelect } from 'src/features/select-chat-room'

import { useI18n } from 'src/shared/preferences'
import { AppInput } from 'src/shared/ui'

export const ForwardMessageModal = ({ onClose }: IForwardMessageModalProps) => {
  const [searchString, setSearchString] = useState('')
  const { selectChatRoomById } = useChatRoomSelect()
  const { t } = useI18n()

  const clickChatHandler = (roomId: string) => {
    selectChatRoomById(roomId)
    // dispatch(setRepliedMessage(message))
    onClose()
  }

  return (
    <div className="forward-message-modal">
      <div className="forward-message-modal__select">
        <AppInput
          name="forward-message-input"
          // prefixSlot={<AppIcon name={'search'} color="text-color" />}
          placeholder={t(FORWARD_MESSAGE_MODAL_I18N.placeholder)}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <ShortChatList searchString={searchString} clickChat={clickChatHandler} />
      </div>
    </div>
  )
}
