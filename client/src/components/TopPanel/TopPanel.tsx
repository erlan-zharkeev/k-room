import { Image, Badge, Button, Tooltip } from 'antd'
import useTypedSelector from '../../hooks/useTypedSelector'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { logOut } from '../../store/authSlice'
import { RouteNames } from 'k-room.types'
import { useNavigate } from 'react-router-dom'

const TopPanel = () => {
  const { username, email, avatar } = useTypedSelector((state) => state.persist.auth.userData)
  const { showTooltips, socketConnected } = useTypedSelector((state) => state.persist.system)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const ButtonWrapper = (
    <Button
      className="borderless transitionless"
      ghost
      onClick={() => {
        dispatch(logOut())
        // navigate(RouteNames.SIGN_IN)
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
              {/* <Avatar size="small" src={avatar} icon={<UserOutlined />} /> */}
              {avatar ? <Image src={avatar} className="custom-avatar" /> : <UserOutlined />}
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
