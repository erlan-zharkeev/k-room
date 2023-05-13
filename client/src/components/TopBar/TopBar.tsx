import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { logOut } from 'src/store/userSlice'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { socket } from 'src/socket/socket'
import { selectChatRoom } from 'src/store/settingsSlice'
import UIButton from 'ui/UIButton'
import UIAvatar from 'ui/UIAvatar'
import { Badge } from 'antd'
import { Dropdown } from 'antd'

const TopBar = () => {
  const { username, email, avatar } = useTypedSelector((state) => state.user.userData)
  const { infoItems } = useTypedSelector((state) => state.system)
  const dispatch = useDispatch<AppDispatch>()

  const resetChat = () => {
    dispatch(selectChatRoom(''))
  }

  const exit = () => {
    dispatch(logOut())
  }

  const unreadInfoQuantity = () => infoItems.filter((item) => item.read === 'read').length

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
          <Badge count={unreadInfoQuantity()}>
            <Dropdown menu={{ items: infoItems }} trigger={['click']} placement="bottom">
              <UIButton iconName="notification-bell" />
            </Dropdown>
          </Badge>
          <UIButton iconName="exit" onClick={() => exit()} />
        </div>
      </div>
    </div>
  )
}

export default TopBar
