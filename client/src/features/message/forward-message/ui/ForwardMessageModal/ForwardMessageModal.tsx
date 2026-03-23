import './style.scss'
import { useState } from 'react'

import { useChatRoomSelect } from 'src/features/chat-room'

import { useTypedSelector } from 'src/shared/lib'
import { AppInput } from 'src/shared/ui'

import { ShortChatList } from './components/ShortChatList/ShortChatList'

export const ForwardMessageModal = ({ onClose }: { onClose: () => void }) => {
  const [searchString, setSearchString] = useState('')
  const { message } = useTypedSelector((state) => state.system.contextMenu.contextClickedObject)
  const { selectChatRoomById } = useChatRoomSelect()

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
          placeholder="Find room"
          onChange={(e) => setSearchString(e.target.value)}
        />
        <ShortChatList searchString={searchString} clickChat={clickChatHandler} />
      </div>
    </div>
  )
}
