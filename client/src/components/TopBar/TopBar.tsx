import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { logOut } from 'src/store/userSlice'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { socket } from 'src/socket/socket'
import { selectChatRoom } from 'src/store/settingsSlice'
import UIButton from 'ui/UIButton'
import UIAvatar from 'ui/UIAvatar'

const TopBar = () => {
  const { username, email, avatar } = useTypedSelector((state) => state.user.userData)
  const dispatch = useDispatch<AppDispatch>()

  const resetChat = () => {
    dispatch(selectChatRoom(''))
  }

  const exit = () => {
    dispatch(logOut())
  }

  return (
    <div className="top-bar" onClick={resetChat}>
      <div className="top-bar__content">
        <div className="top-bar__userdata">
          <div className="top-bar__avatar">
            <UIAvatar online={socket.connected} src={avatar} />
          </div>
          <div className="top-bar__credential">
            <div className="paragraph-text top-bar__username">{username}</div>
            <div className="paragraph-text paragraph-text--secondary">{email}</div>
          </div>
        </div>
        <div className="top-bar__buttons">
          <UIButton iconName="notification-bell" />
          <UIButton iconName="exit" onClick={() => exit()} />
        </div>
      </div>
    </div>
  )
}

export default TopBar
