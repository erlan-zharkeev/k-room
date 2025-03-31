import './style.scss'
import { useDispatch } from 'react-redux'
import { AppAvatar } from 'src/shared/ui'
import { firstCharUpperCase } from 'src/shared/utils'
import { AppDispatch } from 'src/app/store'
import { unsetMinify } from 'src/entities/call'
import { useTypedSelector } from 'src/shared/lib'

export const CallStatusBar = () => {
  const { isMinified } = useTypedSelector((state) => state.calls)
  const { currentCall } = useTypedSelector((state) => state.calls)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div
      className={`call-status-bar ${!isMinified ? 'call-status-bar--hide' : ''}`}
      onClick={() => dispatch(unsetMinify())}
    >
      <div className="call-status-bar__wrapper">
        <div className="call-status-bar__type paragraph-text">{firstCharUpperCase(currentCall.flow)} call</div>
        <div className="call-status-bar__info">
          {currentCall.interlocutorAvatarPath && (
            <div className="call-status-bar__avatar">
              <AppAvatar src={currentCall.interlocutorAvatarPath} showBadge={false} size="small" />
            </div>
          )}
          <div className="call-status-bar__interlocutor-name paragraph-text">{currentCall.interlocutorName}</div>
        </div>
      </div>
    </div>
  )
}
