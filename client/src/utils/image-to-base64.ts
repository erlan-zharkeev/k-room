import { clientConstants } from 'src/client-constants'
import { NotificationMessage, NotificationType } from 'common-types'
import { AppDispatch, showNotification } from 'src/store'

export const imageToBase64 = ({
  image,
  allowedResolutions = clientConstants.imageResolutions,
  dispatch
}: {
  image: File
  dispatch: AppDispatch
  allowedResolutions?: Array<string>
}) => {
  const reader = new FileReader()
  reader.readAsDataURL(image)

  const warnings = []
  const resolutionNotAllowed = !allowedResolutions.includes(image.type)
  if (resolutionNotAllowed) warnings.push(NotificationMessage.imageResNotAllowed)
  const isGreaterThanAllowed = image.size / 1024 / 1024 > clientConstants.maxImageWeightMb
  if (isGreaterThanAllowed) warnings.push(NotificationMessage.imageSizeMustLessThan2mb)

  if (warnings.length) {
    warnings.forEach((warning) => {
      dispatch(showNotification({ message: warning, messageType: NotificationType.warn }))
    })
    return
  }
  return reader
}
