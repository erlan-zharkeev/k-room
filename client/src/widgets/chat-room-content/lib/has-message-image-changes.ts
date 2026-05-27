import type { ImageObject } from 'global-shared'

export const hasMessageImageChanges = (currentImages: readonly ImageObject[], nextImages: readonly ImageObject[]) => {
  const hasDifferentLength = currentImages.length !== nextImages.length

  if (hasDifferentLength) return true

  return currentImages.some((image, index) => image.src !== nextImages[index].src)
}
