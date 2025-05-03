import './style.scss'
import { useState } from 'react'

import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { useRoomSelect } from 'src/features/room'

import { setRepliedMessage } from 'src/entities/chat-room'
import { closeModal } from 'src/entities/system'

import { useTypedSelector } from 'src/shared/lib'
import { AppInput, AppIcon } from 'src/shared/ui'

import { ShortChatList } from './components/ShortChatList/ShortChatList'

export const ForwardMessagePopup = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [searchString, setSearchString] = useState('')
  const { message } = useTypedSelector((state) => state.system.contextMenu.contextClickedObject)
  const { selectRoomById } = useRoomSelect()

  const clickChatHandler = (roomId: string) => {
    selectRoomById(roomId)
    dispatch(setRepliedMessage(message))
    dispatch(closeModal())
  }

  return (
    <div className="forward-message-popup">
      <div className="forward-message-popup__select">
        <AppInput
          suffix={<AppIcon name={'search'} color={'default'} />}
          placeholder="Find room"
          onChange={(e) => setSearchString(e.target.value)}
        />
        <ShortChatList searchString={searchString} clickChat={clickChatHandler} />
      </div>
    </div>
  )
}
