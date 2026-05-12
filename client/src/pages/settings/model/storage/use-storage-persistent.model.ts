import { onMounted, ref } from 'vue'

import { log, TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import { SETTINGS_PAGE_STORAGE_I18N } from '../../config/i18n/storage.i18n'

export const useStoragePersistent = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const isPersistenceSupported = Boolean(navigator.storage?.persist)
  const isPersistent = ref(false)
  const isPersistenceLoading = ref(false)

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
      isPersistenceLoading.value = true

      const granted = await navigator.storage.persist()
      isPersistent.value = granted

      toast.add({
        type: granted ? 'success' : 'warning',
        title: t(granted ? TOAST_I18N.success : TOAST_I18N.warn),
        content: t(
          granted
            ? SETTINGS_PAGE_STORAGE_I18N.storagePersistentRequestGranted
            : SETTINGS_PAGE_STORAGE_I18N.storagePersistentRequestDenied
        )
      })
    } catch (error) {
      log('warn', 'Persistent storage request failed', error)
      isPersistent.value = false
      toast.add({
        type: 'warning',
        title: t(TOAST_I18N.warn),
        content: t(SETTINGS_PAGE_STORAGE_I18N.storagePersistentRequestFailed)
      })
    } finally {
      isPersistenceLoading.value = false
    }
  }

  onMounted(() => {
    void loadPersistenceStatus()
  })

  return {
    isPersistenceSupported,
    isPersistent,
    isPersistenceLoading,
    requestPersistence
  }
}
