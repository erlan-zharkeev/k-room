import { Notification } from 'src/shared/notification/types'
import { AppIconName, ColorModifier, AppIcon } from 'src/shared/ui'

const notificationIconMap: Record<Notification, { name: AppIconName; color: ColorModifier }> = {
  success: {
    name: 'success',
    color: 'success-color'
  },
  warning: {
    name: 'warn',
    color: 'warn-color'
  },
  error: {
    name: 'cross',
    color: 'error-color'
  },
  info: {
    name: 'info',
    color: 'accent-color'
  }
}

export const getNotificationIcon = (messageType: Notification) => (
  <AppIcon name={notificationIconMap[messageType].name} color={notificationIconMap[messageType].color} />
)
