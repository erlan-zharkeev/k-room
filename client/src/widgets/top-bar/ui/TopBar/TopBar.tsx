import './style.scss'
import { WidgetWrapper } from 'src/widgets/widget-wrapper'

import { LogoutButton } from 'src/features/auth/logout'
import { InfoMessageBtn } from 'src/features/info-notification'
import { SocketConnectionStatusInfo } from 'src/features/socket'

import { UserProfile } from 'src/entities/user'

export const TopBar = () => {
  return (
    <WidgetWrapper name="top-bar">
      <div className="top-bar__content">
        <UserProfile />
        <div className="top-bar__action-btns">
          <SocketConnectionStatusInfo />
          <InfoMessageBtn />
          <LogoutButton />
        </div>
      </div>
    </WidgetWrapper>
  )
}
