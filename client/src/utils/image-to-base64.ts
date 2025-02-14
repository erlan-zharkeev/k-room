import { clientConstants } from 'src/client-constants'
import { ClientNotificationMessage } from 'src/@enums'
import { UseNotification } from 'src/hooks/use-notification'

export const imageToBase64 = ({
  image,
  allowedResolutions = clientConstants.imageResolutions,
  notifications
}: {
  image: File
  allowedResolutions?: Array<string>
  notifications: UseNotification
}) => {
  const reader = new FileReader()
  reader.readAsDataURL(image)
  const warnings = []
  const resolutionNotAllowed = !allowedResolutions.includes(image.type)
  if (resolutionNotAllowed) warnings.push(ClientNotificationMessage.ImageResNotAllowed)
  const isGreaterThanAllowed = image.size / 1024 / 1024 > clientConstants.maxImageWeightMb
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
