import ShortChatList from './Components/ShortChatList/ShortChatList'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { UIInput, UIIcon } from 'src/components/UI'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { AppDispatch } from 'src/store'
import { setRepliedMessage } from 'src/store/roomsSlice'
import { selectChatRoom } from 'src/store/settingsSlice'
import { closeModal } from 'src/store/systemSlice'

const ForwardMessagePopup = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [searchString, setSearchString] = useState('')
  const { message } = useTypedSelector((state) => state.system.contextMenu.contextClickedObject)

  const clickChatHandler = (roomId: string) => {
    dispatch(selectChatRoom(roomId))
    dispatch(setRepliedMessage(message))
    dispatch(closeModal())
  }

  return (
    <div className="forward-message-popup">
      <div className="forward-message-popup__select">
        <UIInput
          size="small"
          suffix={<UIIcon name={'search'} color={'default'} />}
          placeholder="Find room"
          onChange={(e) => setSearchString(e.target.value)}
        />
        <ShortChatList searchString={searchString} clickChat={clickChatHandler} />
      </div>
    </div>
  )
}

export default ForwardMessagePopup
