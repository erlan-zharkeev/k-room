import './style.scss'

import { createClassNameWithModifiers, firstCharUpperCase } from 'src/shared/lib'
import { AppAvatar } from 'src/shared/ui'

import { useCall } from '../../../../call/operations/use-call'

export const CallStatusBar = () => {
  const { isMinified, currentCall, minifyCallWindow } = useCall()
  const className = createClassNameWithModifiers({
    rootClass: 'call-status-bar',
    modifiers: [!isMinified && 'hide']
  })

  return (
    <button type="button" className={className} onClick={minifyCallWindow}>
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
    </button>
  )
}
