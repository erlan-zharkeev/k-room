import { storeToRefs } from 'pinia'

import { useSystemStore } from './system.store.model'

export const useSystem = () => {
  const systemStore = useSystemStore()
  const { hasInteracted } = storeToRefs(systemStore)

  return {
    hasInteracted,
    reset: () => systemStore.reset(),
    setHasInteracted: (payload: boolean) => systemStore.setHasInteracted(payload)
  }
}
