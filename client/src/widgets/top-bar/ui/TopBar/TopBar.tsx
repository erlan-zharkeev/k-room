import './style.scss'
import { WidgetWrapper } from 'src/widgets/widget-wrapper'

import { LogoutButton } from 'src/features/auth'
import { InfoMessageBtn } from 'src/features/info-notification'

import { UserProfile } from 'src/entities/user'

import { ConnectionStatusInfo } from '../../../connection-status-info'

export const TopBar = () => {
  return (
    <WidgetWrapper name="top-bar">
      <div className="top-bar__content">
        <UserProfile />
        <div className="top-bar__action-btns">
          <ConnectionStatusInfo />
          <InfoMessageBtn />
          <LogoutButton />
        </div>
      </div>
    </WidgetWrapper>
  )
}
