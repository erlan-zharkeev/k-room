import { ref } from 'vue'

import { useMedia } from 'src/entities/media-file'
import { loadStorageEstimate } from 'src/shared/lib'

export const useStorageClear = () => {
  const { reset: resetMedia } = useMedia()

  const isClearingMedia = ref(false)

  const clearMedia = async () => {
    isClearingMedia.value = true

    try {
      await resetMedia()
      await loadStorageEstimate()
    } finally {
      isClearingMedia.value = false
    }
  }

  return {
    isClearingMedia,
    clearMedia
  }
}
