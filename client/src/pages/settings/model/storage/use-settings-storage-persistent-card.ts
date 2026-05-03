import { onMounted, ref } from 'vue'

export const useSettingsStoragePersistentCard = () => {
  const isPersistenceSupported = Boolean(navigator.storage?.persist)
  const isPersistent = ref(false)

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

  onMounted(() => {
    void loadPersistenceStatus()
  })

  return {
    isPersistenceSupported,
    isPersistent,
    requestPersistence
  }
}
