import { ref } from 'vue'

import { useMedia } from 'src/entities/media-file'

export const useStorageClear = () => {
  const { reset: resetMedia } = useMedia()

  const isClearingMedia = ref(false)

  const clearMedia = async () => {
    isClearingMedia.value = true

    try {
      await resetMedia()
    } finally {
      isClearingMedia.value = false
    }
  }

  return {
    isClearingMedia,
    clearMedia
  }
}
