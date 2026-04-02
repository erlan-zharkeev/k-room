import { useState } from 'react'

import './style.scss'

import type { IDontShowNotificationAgainBtnProps } from 'src/entities/notification/ui'
import { DONT_SHOW_NOTIFICATION_AGAIN_BTN_I18N } from 'src/entities/notification/ui'
import { useSettings, useI18n } from 'src/entities/settings'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { AppButton } from 'src/shared/ui'

export const DontShowNotificationAgainBtn = ({ notificationName }: IDontShowNotificationAgainBtnProps) => {
  const settings = useSettings()
  const [clicked, setClicked] = useState(false)
  const { t } = useI18n()
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
      <AppButton text={t(DONT_SHOW_NOTIFICATION_AGAIN_BTN_I18N.button)} color="accent-color" />
    </div>
  )
}
