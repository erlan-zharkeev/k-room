import { useUser } from 'src/entities/user'

import { useSettings } from 'src/shared/preferences'

export const useInitializeIndexedDb = () => {
  const settings = useSettings()
  const user = useUser()

  const stores = [settings, user]
  const initializeIndexedDb = async () => {
    return Promise.all(stores.map(async (store) => store.initialize()))
  }
  return { initializeIndexedDb }
}
