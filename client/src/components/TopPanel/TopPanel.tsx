import { Image, Badge, Button, Tooltip, Avatar } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { logOut } from 'src/store/authSlice'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { selectChatRoom } from 'src/store/systemSlice'
const Logo = require('src/assets/images/Logo.svg') as string

const TopPanel = () => {
  const { username, email, avatar } = useTypedSelector((state) => state.auth.userData)
  const { showTooltips, socketConnected } = useTypedSelector((state) => state.persist.system)
  const dispatch = useDispatch<AppDispatch>()

  const ButtonWrapper = (
    <Button
      className="borderless transitionless"
      ghost
      onClick={() => {
        dispatch(logOut())
      }}
      icon={<LogoutOutlined />}
    />
  )

  const resetChat = () => {
    dispatch(selectChatRoom(''))
  }

  return (
    <div className="top-panel" onClick={resetChat}>
      <div className="top-panel__logo">
        <img className="logo" src={Logo}></img>
      </div>
      <div className="top-panel__content">
        <div className="top-panel__userdata">
          <div className="top-panel__avatar">
            <Badge dot color={socketConnected ? 'green' : 'red'}>
              {avatar ? (
                <Image src={avatar} className="custom-avatar" />
              ) : (
                <Avatar size="small" src={avatar} icon={<UserOutlined />} />
              )}
            </Badge>
          </div>
          <div className="paragraph-text top-panel__username">{username}</div>
          <div className="paragraph-text paragraph-text--secondary">{email}</div>
        </div>
        <div className="log-out">
          {showTooltips ? (
            <Tooltip placement="bottomLeft" title="Log out">
              {ButtonWrapper}
            </Tooltip>
          ) : (
            ButtonWrapper
          )}
        </div>
      </div>
    </div>
  )
}

export default TopPanel
