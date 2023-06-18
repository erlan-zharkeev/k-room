import constants from 'src/constants'
import { AppDispatch } from 'src/store'
import { showNotification } from 'src/store/systemSlice'

const imageToBase64 = ({
  file,
  allowedResolutions = constants.imageResolutions,
  dispatch
}: {
  file: File
  dispatch: AppDispatch
  allowedResolutions?: Array<string>
}) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)

  const warnings = []
  const resolutionNotAllowed = !allowedResolutions.includes(file.type)
  if (resolutionNotAllowed) warnings.push('Image resolution not allowed')
  const isGreaterThanAllowed = file.size / 1024 / 1024 > constants.maxImageWeightMb
  if (isGreaterThanAllowed) warnings.push(`Image size must be less than ${constants.maxImageWeightMb}mb`)

  if (warnings.length) {
    warnings.forEach((warning) => {
      dispatch(showNotification({ message: warning, messageType: 'warning' }))
    })
    return
  }
  return reader
}

export default imageToBase64
