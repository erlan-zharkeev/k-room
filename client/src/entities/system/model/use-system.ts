import { storeToRefs } from 'pinia'

import { pinia } from 'src/shared/lib'

import { useSystemStore } from './system.store'

export const useSystem = () => {
  const systemStore = useSystemStore(pinia)
  const { hasInteracted } = storeToRefs(systemStore)

  return {
    hasInteracted,
    reset: () => systemStore.reset(),
    setHasInteracted: (payload: boolean) => systemStore.setHasInteracted(payload)
  }
}
