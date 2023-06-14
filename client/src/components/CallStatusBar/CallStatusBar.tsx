import useTypedSelector from 'src/hooks/useTypedSelector'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { unsetMinify } from 'src/store/callsSlice'
import UIAvatar from 'src/components/UI/UIAvatar/UIAvatar'

const CallStatusBar = () => {
  const { isMinified } = useTypedSelector((state) => state.calls)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div
      className={`call-status-bar ${!isMinified ? 'call-status-bar--hide' : ''}`}
      onClick={() => dispatch(unsetMinify())}
    >
      <div className="call-status-bar__wrapper">
        <div className="call-status-bar__type paragraph-text">Incoming audio call</div>
        <div className="call-status-bar__info">
          <div className="call-status-bar__avatar">
            <UIAvatar src="" showBadge={false} />
          </div>
          <div className="call-status-bar__interlocutor-name paragraph-text">Иван Судовых</div>
          <div className="call-status-bar__length paragraph-text">09:20</div>
        </div>
      </div>
    </div>
  )
}

export default CallStatusBar
