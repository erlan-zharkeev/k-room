
import type { NotificationType } from 'src/entities/notification'

import type { AppIconNameType, ColorModifierType } from 'src/shared/ui'
import { AppIcon } from 'src/shared/ui'

const notificationIconMap: Record<NotificationType, { name: AppIconNameType; color: ColorModifierType }> = {
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
