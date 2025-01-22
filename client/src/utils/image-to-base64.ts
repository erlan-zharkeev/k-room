import { clientConstants } from 'src/client-constants'
import { NotificationMessage, NotificationType } from 'common-types'
import { useNotification } from 'src/hooks'

export const imageToBase64 = ({
  image,
  allowedResolutions = clientConstants.imageResolutions,
}: {
  image: File
  allowedResolutions?: Array<string>
}) => {
  const reader = new FileReader()
  reader.readAsDataURL(image)
  const notifications = useNotification();

  const warnings = []
  const resolutionNotAllowed = !allowedResolutions.includes(image.type)
  if (resolutionNotAllowed) warnings.push(NotificationMessage.imageResNotAllowed)
  const isGreaterThanAllowed = image.size / 1024 / 1024 > clientConstants.maxImageWeightMb
  if (isGreaterThanAllowed) warnings.push(NotificationMessage.imageSizeMustLessThan2mb)

  if (warnings.length) {
    warnings.forEach((warning) => {
      const warningNotification = notifications.getNotification({ message: warning, messageType: NotificationType.warn })
      warningNotification.open()
    })
    return
  }
  return reader
}
