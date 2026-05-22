import { LocalizedText } from 'common'

import { IMAGE_RESOLUTIONS } from 'src/shared/config'
import { NOTIFICATION_I18N, UseNotification } from 'src/shared/notification'

export const imageToBase64 = ({
  image,
  allowedResolutions = Object.values(IMAGE_RESOLUTIONS),
  notifications,
  t,
  maxImageSizeInMb = 5
}: {
  image: File
  allowedResolutions?: string[]
  notifications: UseNotification
  t: <T>(texts: LocalizedText<T>) => T
  maxImageSizeInMb?: number
}) => {
  const reader = new FileReader()
  reader.readAsDataURL(image)
  const warnings = []
  const resolutionNotAllowed = !allowedResolutions.includes(image.type)
  if (resolutionNotAllowed) warnings.push(t(NOTIFICATION_I18N.imageResNotAllowed))
  const isGreaterThanAllowed = image.size / 1024 / 1024 > maxImageSizeInMb
  if (isGreaterThanAllowed) warnings.push(t(NOTIFICATION_I18N.imageSizeMustLessThan(maxImageSizeInMb)))

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
