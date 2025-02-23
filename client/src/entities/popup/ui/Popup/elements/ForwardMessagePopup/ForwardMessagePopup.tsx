import './style.scss'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from 'src/shared/lib'
import { AppDispatch } from 'src/app/store'
import { ShortChatList } from './components/ShortChatList/ShortChatList'
import { Input, Icon } from 'src/shared/ui'
import { setRepliedMessage } from 'src/entities/chat-room'
import { closeModal } from 'src/entities/system'
import { useSettings } from 'src/entities/settings'

export const ForwardMessagePopup = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { updateSetting } = useSettings()
  const [searchString, setSearchString] = useState('')
  const { message } = useTypedSelector((state) => state.system.contextMenu.contextClickedObject)
  const clickChatHandler = (roomId: string) => {
    updateSetting('selectedChatRoomId', { selectChatRoomId: roomId })
    dispatch(setRepliedMessage(message))
    dispatch(closeModal())
  }

  return (
    <div className="forward-message-popup">
      <div className="forward-message-popup__select">
        <Input
          size="small"
          suffix={<Icon name={'search'} color={'default'} />}
          placeholder="Find room"
          onChange={(e) => setSearchString(e.target.value)}
        />
        <ShortChatList searchString={searchString} clickChat={clickChatHandler} />
      </div>
    </div>
  )
}
