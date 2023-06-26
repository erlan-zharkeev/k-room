import constants from 'src/constants'
import { AppDispatch } from 'src/store'
import { showNotification } from 'src/store/systemSlice'

export const imageToBase64 = ({
  image,
  allowedResolutions = constants.imageResolutions,
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
  if (resolutionNotAllowed) warnings.push('Image resolution not allowed')
  const isGreaterThanAllowed = image.size / 1024 / 1024 > constants.maxImageWeightMb
  if (isGreaterThanAllowed) warnings.push(`Image size must be less than ${constants.maxImageWeightMb}mb`)

  if (warnings.length) {
    warnings.forEach((warning) => {
      dispatch(showNotification({ message: warning, messageType: 'warning' }))
    })
    return
  }
  return reader
}
