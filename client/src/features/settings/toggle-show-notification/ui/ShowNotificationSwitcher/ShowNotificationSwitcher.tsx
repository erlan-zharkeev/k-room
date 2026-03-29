import './style.scss'

import { useSettings } from 'src/entities/settings'
import { useI18n } from 'src/entities/system'

import { AppSwitch, AppText, AppTooltip } from 'src/shared/ui'

import { useShowNotification, SHOW_NOTIFICATION_SWITCHER_I18N } from '../..'

export const ShowNotificationSwitcher = () => {
  const { showNotification } = useSettings()
  const { toggleShowNotification } = useShowNotification()
  const { t } = useI18n()

  return (
    <div className="show-notification-switcher">
      <AppText size="small">{t(SHOW_NOTIFICATION_SWITCHER_I18N.label)}</AppText>
      <AppTooltip text={t(SHOW_NOTIFICATION_SWITCHER_I18N.tooltip)} placement="bottom">
        <AppSwitch
          value={showNotification}
          name="notification"
          onText={t(SHOW_NOTIFICATION_SWITCHER_I18N.show)}
          offText={t(SHOW_NOTIFICATION_SWITCHER_I18N.hide)}
          onChange={toggleShowNotification}
        />
      </AppTooltip>
    </div>
  )
}
