import { useState } from 'react'

import './style.scss'
import { useSettings } from 'src/entities/settings'

import { HiddenNotificationType } from 'src/shared/config'
import { AppButton } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

export const DontShowNotificationAgainBtn = ({ notificationName }: { notificationName: HiddenNotificationType }) => {
  const settings = useSettings()
  const [clicked, setClicked] = useState(false)
  const className = createClassNameWithModifiers({
    rootClass: 'dont-show-notification-again-btn',
    modifiers: [clicked && 'clicked']
  })

  const clickHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    setClicked(true)
    e.stopPropagation()
    e.preventDefault()
    settings.setByPath('hiddenNotification', [...(settings.hiddenNotification ?? []), notificationName])
  }

  return (
    <div className={className} onMouseDownCapture={clickHandler}>
      <AppButton text="Don't show again" color="accent-color" />
    </div>
  )
}
