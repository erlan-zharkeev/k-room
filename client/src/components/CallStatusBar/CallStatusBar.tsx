import { Avatar } from 'antd'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { UserOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { unsetMinify } from 'src/store/callsSlice'

export const CallStatusBar = () => {
  const { isMinified } = useTypedSelector((state) => state.calls)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div
      className={`call-status-bar ${!isMinified ? 'call-status-bar--hide' : ''}`}
      onClick={() => dispatch(unsetMinify())}
    >
      <div className="call-status-bar__wrapper">
        <div className="call-status-bar__type">Incoming audio call</div>
        <div className="call-status-bar__info">
          <div className="call-status-bar__avatar">
            <Avatar size="small" src="" icon={<UserOutlined />} />
          </div>
          <div className="call-status-bar__interlocutor-name">Иван Судовых</div>
          <div className="call-status-bar__length">09:20</div>
        </div>
      </div>
    </div>
  )
}

export default CallStatusBar
