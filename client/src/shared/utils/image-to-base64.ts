import { ClientNotificationMessage, UseNotification } from 'src/entities/notification'

import { ImageResolutions } from '../types'

const MAX_IMAGE_WEIGHT_IN_MB = 2

export const imageToBase64 = ({
  image,
  allowedResolutions = Object.values(ImageResolutions),
  notifications
}: {
  image: File
  allowedResolutions?: string[]
  notifications: UseNotification
}) => {
  const reader = new FileReader()
  reader.readAsDataURL(image)
  const warnings = []
  const resolutionNotAllowed = !allowedResolutions.includes(image.type)
  if (resolutionNotAllowed) warnings.push(ClientNotificationMessage.ImageResNotAllowed)
  const isGreaterThanAllowed = image.size / 1024 / 1024 > MAX_IMAGE_WEIGHT_IN_MB
  if (isGreaterThanAllowed) warnings.push(ClientNotificationMessage.ImageSizeMustLessThan2mb)

  if (warnings.length) {
    warnings.forEach((warning) => {
      const warningNotification = notifications.getNotification({
        message: warning,
        messageType: 'warning'
      })
      warningNotification.open()
    })
    return
  }
  return reader
}
