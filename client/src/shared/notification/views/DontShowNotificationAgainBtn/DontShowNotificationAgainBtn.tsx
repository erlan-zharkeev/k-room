import { useState } from 'react'

import '../../views/DontShowNotificationAgainBtn/style.scss'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { IDontShowNotificationAgainBtnProps, DONT_SHOW_NOTIFICATION_AGAIN_BTN_I18N } from 'src/shared/notification'
import { useSettings, useI18n } from 'src/shared/preferences'
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
    settings.shallowUpdate({
      hiddenNotification: [...(settings.hiddenNotification ?? []), notificationName]
    })
  }

  return (
    <div className={className} onMouseDownCapture={clickHandler}>
      <AppButton text={t(DONT_SHOW_NOTIFICATION_AGAIN_BTN_I18N.button)} color="accent-color" />
    </div>
  )
}
