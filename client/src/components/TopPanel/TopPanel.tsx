import { Image, Badge, Button, Tooltip, Avatar } from 'antd'
import useTypedSelector from '../../hooks/useTypedSelector'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { logOut } from '../../store/authSlice'

const TopPanel = () => {
  const { id, username, email, avatar } = useTypedSelector((state) => state.auth.userData)
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

  return (
    <div className="top-panel">
      <div className="top-panel__logo"></div>
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
