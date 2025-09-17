import { useState } from 'react'

import './style.scss'
import { useSettings } from 'src/entities/settings'

import { HiddenNotificationType } from 'src/shared/config'
import { AppButton } from 'src/shared/ui'

export const DontShowNotificationAgainBtn = ({ notificationName }: { notificationName: HiddenNotificationType }) => {
  const settings = useSettings()
  const [clicked, setClicked] = useState(false)

  const clickHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    setClicked(true)
    e.stopPropagation()
    e.preventDefault()
    settings.setByPath('hiddenNotification', [...(settings.hiddenNotification ?? []), notificationName])
  }

  return (
    <div
      className={`dont-show-notification-again-btn ${clicked ? 'dont-show-notification-again-btn--clicked' : ''}`}
      onMouseDownCapture={clickHandler}
    >
      <AppButton text="Don't show again" color="accent-color" />
    </div>
  )
}
