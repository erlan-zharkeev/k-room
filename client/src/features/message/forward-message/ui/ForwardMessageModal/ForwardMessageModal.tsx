import './style.scss'
import { useState } from 'react'

import { useChatRoomSelect } from 'src/features/chat-room'
import { FORWARD_MESSAGE_MODAL_I18N } from 'src/features/message/forward-message/ui/ForwardMessageModal/config'

import { useI18n } from 'src/entities/system'

import { AppInput } from 'src/shared/ui'

import { ShortChatList } from './components'

export const ForwardMessageModal = ({ onClose }: { onClose: () => void }) => {
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
