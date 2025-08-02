import './style.scss'
import { useState } from 'react'

import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { useChatRoomSelect } from 'src/features/chat-room'

import { setRepliedMessage } from 'src/entities/chat-room'
import { closeModal } from 'src/entities/system'

import { useTypedSelector } from 'src/shared/lib'
import { AppInput, AppIcon } from 'src/shared/ui'

import { ShortChatList } from './components/ShortChatList/ShortChatList'

export const ForwardMessageModal = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [searchString, setSearchString] = useState('')
  const { message } = useTypedSelector((state) => state.system.contextMenu.contextClickedObject)
  const { selectChatRoomById } = useChatRoomSelect()

  const clickChatHandler = (roomId: string) => {
    selectChatRoomById(roomId)
    dispatch(setRepliedMessage(message))
    dispatch(closeModal())
  }

  return (
    <div className="forward-message-modal">
      <div className="forward-message-modal__select">
        <AppInput
          // prefixSlot={<AppIcon name={'search'} color="text-color" />}
          placeholder="Find room"
          onChange={(e) => setSearchString(e.target.value)}
        />
        <ShortChatList searchString={searchString} clickChat={clickChatHandler} />
      </div>
    </div>
  )
}
