import './style.scss'

import { useSettings } from 'src/entities/settings'

import { AppSwitch, AppText, AppTooltip } from 'src/shared/ui'

import { useShowNotification } from '../../hooks'

export const ShowNotificationSwitcher = () => {
  const { showNotification } = useSettings()
  const { toggleShowNotification } = useShowNotification()

  return (
    <div className="show-notification-switcher">
      <AppText size="small">Notification</AppText>
      <AppTooltip
        text="If you want to disable/enable browser notifications, you need to do this manually (the setting next to the
          address bar), the security policy does not allow you to do this from the application interface. The current
          setting is responsible for notification toasts inside the app."
        placement="bottom"
      >
        <AppSwitch
          value={showNotification}
          name="notification"
          onText="Show"
          offText="Hide"
          onChange={toggleShowNotification}
        />
      </AppTooltip>
    </div>
  )
}
