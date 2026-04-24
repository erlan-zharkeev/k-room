import './forward-message-modal.scss'
import { useState } from 'react'

import { useI18n, useSettings } from 'src/shared/preferences'
import { AppInput } from 'src/shared/ui'

import { FORWARD_MESSAGE_MODAL_I18N } from './i18n.ts'
import { IForwardMessageModalProps } from './forward-message.types.ts'
import { ShortChatList } from '../ShortChatList/ShortChatList'

export const ForwardMessageModal = ({ onClose }: IForwardMessageModalProps) => {
  const [searchString, setSearchString] = useState('')
  const { shallowUpdate } = useSettings()
  const { t } = useI18n()

  const clickChatHandler = (roomId: string) => {
    shallowUpdate({ selectedChatRoomId: roomId, selectedContentTab: 'chat-rooms' })
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
