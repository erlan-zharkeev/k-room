import ShortChatList from './Components/ShortChatList/ShortChatList'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import UIIcon from 'src/components/UI/UIIcon/UIIcon'
import UIInput from 'src/components/UI/UIInput/UIInput'
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
      <div className="tech-settings-popup__select">
        <UIInput
          size="small"
          suffix={<UIIcon name={'search'} color={'default'} />}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <ShortChatList searchString={searchString} clickChat={clickChatHandler} />
      </div>
    </div>
  )
}

export default ForwardMessagePopup
