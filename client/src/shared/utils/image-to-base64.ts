import { NOTIFICATION_MESSAGE, UseNotificationType } from 'src/entities/notification'

import { IMAGE_RESOLUTIONS } from 'src/shared/config/types'

export const imageToBase64 = ({
  image,
  allowedResolutions = Object.values(IMAGE_RESOLUTIONS),
  notifications,
  maxImageSizeInMb = 5
}: {
  image: File
  allowedResolutions?: string[]
  notifications: UseNotificationType
  maxImageSizeInMb?: number
}) => {
  const reader = new FileReader()
  reader.readAsDataURL(image)
  const warnings = []
  const resolutionNotAllowed = !allowedResolutions.includes(image.type)
  if (resolutionNotAllowed) warnings.push(NOTIFICATION_MESSAGE.imageResNotAllowed())
  const isGreaterThanAllowed = image.size / 1024 / 1024 > maxImageSizeInMb
  if (isGreaterThanAllowed) warnings.push(NOTIFICATION_MESSAGE.imageSizeMustLessThan(maxImageSizeInMb))

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
