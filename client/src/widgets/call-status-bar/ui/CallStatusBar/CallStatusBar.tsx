import './style.scss'
import { useCall } from 'src/entities/call'

import { AppAvatar } from 'src/shared/ui'
import { createClassNameWithModifiers, firstCharUpperCase } from 'src/shared/utils'

export const CallStatusBar = () => {
  const { isMinified, currentCall, minifyCallWindow } = useCall()
  const className = createClassNameWithModifiers({
    rootClass: 'call-status-bar',
    modifiers: [!isMinified && 'hide']
  })

  return (
    <div className={className} onClick={minifyCallWindow}>
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
