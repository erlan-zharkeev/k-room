import { isNumber } from 'global-shared'

import type { FileMetadata } from '../media.types'

export const buildImageAspectRatioDetails = (metadata?: Partial<FileMetadata>) => {
  const width = metadata?.width
  const height = metadata?.height
  const hasFiniteWidth = isNumber(width) && Number.isFinite(width)
  const hasFiniteHeight = isNumber(height) && Number.isFinite(height)

  if (!hasFiniteWidth || !hasFiniteHeight) return {}

  const hasPositiveWidth = width > 0
  const hasPositiveHeight = height > 0

  if (!hasPositiveWidth || !hasPositiveHeight) return {}

  return {
    aspectRatio: width / height
  }
}
