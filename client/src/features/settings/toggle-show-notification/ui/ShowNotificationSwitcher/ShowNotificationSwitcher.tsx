import './style.scss'

import { useShowNotification, SHOW_NOTIFICATION_SWITCHER_TEXT } from 'src/features/settings/toggle-show-notification'

import { useSettings } from 'src/entities/settings'
import { useI18n } from 'src/entities/system'

import { AppSwitch, AppText, AppTooltip } from 'src/shared/ui'

export const ShowNotificationSwitcher = () => {
  const { showNotification } = useSettings()
  const { toggleShowNotification } = useShowNotification()
  const { t } = useI18n()

  return (
    <div className="show-notification-switcher">
      <AppText size="small">{t(SHOW_NOTIFICATION_SWITCHER_TEXT.label)}</AppText>
      <AppTooltip text={t(SHOW_NOTIFICATION_SWITCHER_TEXT.tooltip)} placement="bottom">
        <AppSwitch
          value={showNotification}
          name="notification"
          onText={t(SHOW_NOTIFICATION_SWITCHER_TEXT.show)}
          offText={t(SHOW_NOTIFICATION_SWITCHER_TEXT.hide)}
          onChange={toggleShowNotification}
        />
      </AppTooltip>
    </div>
  )
}
