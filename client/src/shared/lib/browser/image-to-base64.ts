import { IMAGE_RESOLUTIONS } from 'src/shared/config'

import type { IImageToBase64Params } from './types'

export const imageToBase64 = ({
  image,
  allowedResolutions = Object.values(IMAGE_RESOLUTIONS),
  t,
  maxImageSizeInMb = 5
}: IImageToBase64Params) => {
  const reader = new FileReader()
  const warnings = []
  const resolutionNotAllowed = !allowedResolutions.includes(image.type)

  reader.readAsDataURL(image)

  if (resolutionNotAllowed)
    warnings.push(t({ ru: 'Недопустимый формат изображения', en: 'Image format is not allowed' }))

  const isGreaterThanAllowed = image.size / 1024 / 1024 > maxImageSizeInMb

  if (isGreaterThanAllowed) {
    warnings.push(
      t({
        ru: `Размер изображения должен быть меньше ${maxImageSizeInMb} МБ`,
        en: `Image size must be less than ${maxImageSizeInMb} MB`
      })
    )
  }

  if (warnings.length) return

  return reader
}
