import './style.scss'
import { ReactNode } from 'react'

import { LogoutButton } from 'src/features/logout'

import { useLiveMediaUrl } from 'src/entities/media-file'
import { UserProfile, useUser } from 'src/entities/user'

import { WidgetWrapper } from 'src/shared/ui'

import { InfoNotificationButton } from './InfoNotificationButton/InfoNotificationButton'

export const TopBar = ({ children }: { children?: ReactNode }) => {
  const { id } = useUser()
  const avatarPath = useLiveMediaUrl(`avatar.${id}`)

  return (
    <WidgetWrapper name="top-bar">
      <div className="top-bar__content">
        <UserProfile avatarPath={avatarPath} />
        <div className="top-bar__action-btns">
          {children}
          <InfoNotificationButton />
          <LogoutButton />
        </div>
      </div>
    </WidgetWrapper>
  )
}
