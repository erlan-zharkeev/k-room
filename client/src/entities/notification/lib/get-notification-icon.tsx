import type { NotificationType } from 'src/entities/notification'

import type { AppIconName, ColorModifier } from 'src/shared/ui'
import { AppIcon } from 'src/shared/ui'

const notificationIconMap: Record<NotificationType, { name: AppIconName; color: ColorModifier }> = {
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

export const getNotificationIcon = (messageType: NotificationType) => (
  <AppIcon name={notificationIconMap[messageType].name} color={notificationIconMap[messageType].color} />
)
