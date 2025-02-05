import { useDispatch } from 'react-redux'
import { useTypedSelector } from 'src/hooks'
import { AppDispatch, unsetMinify } from 'src/store'
import { firstCharUpperCase } from 'src/utils'
import { UIAvatar } from '..'

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
        <div className="call-status-bar__type paragraph-text">{firstCharUpperCase(currentCall.type)} call</div>
        <div className="call-status-bar__info">
          {currentCall.interlocutorAvatarPath && (
            <div className="call-status-bar__avatar">
              <UIAvatar src={currentCall.interlocutorAvatarPath} showBadge={false} size="extra-small" />
            </div>
          )}
          <div className="call-status-bar__interlocutor-name paragraph-text">{currentCall.interlocutorName}</div>
        </div>
      </div>
    </div>
  )
}
