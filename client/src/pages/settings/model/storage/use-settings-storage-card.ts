import { onMounted, ref } from 'vue'

import { useMedia } from 'src/entities/media-file'

export const useSettingsStorageCard = () => {
  const { reset: resetMedia } = useMedia()

  const isPersistenceSupported = Boolean(navigator.storage?.persist)

  const usageBytes = ref(0)
  const quotaBytes = ref(0)
  const usagePercent = ref(0)
  const isPersistent = ref(false)
  const isClearingMedia = ref(false)

  const loadEstimate = async () => {
    if (!navigator.storage?.estimate) return

    try {
      const { usage = 0, quota = 0 } = await navigator.storage.estimate()

      usageBytes.value = usage
      quotaBytes.value = quota
      usagePercent.value = quota > 0 ? Math.min(Math.round((usage / quota) * 100), 100) : 0
    } catch {
      usageBytes.value = 0
      quotaBytes.value = 0
      usagePercent.value = 0
    }
  }

  const loadPersistenceStatus = async () => {
    if (!navigator.storage?.persisted) return

    try {
      isPersistent.value = await navigator.storage.persisted()
    } catch {
      isPersistent.value = false
    }
  }

  const requestPersistence = async () => {
    if (!navigator.storage?.persist) return

    try {
      isPersistent.value = await navigator.storage.persist()
    } catch {
      isPersistent.value = false
    }
  }

  const clearMedia = async () => {
    isClearingMedia.value = true

    try {
      await resetMedia()
    } finally {
      isClearingMedia.value = false
      await loadEstimate()
    }
  }

  onMounted(async () => {
    await Promise.allSettled([loadEstimate(), loadPersistenceStatus()])
  })

  return {
    usageBytes,
    quotaBytes,
    usagePercent,
    isPersistenceSupported,
    isPersistent,
    isClearingMedia,
    requestPersistence,
    clearMedia
  }
}
