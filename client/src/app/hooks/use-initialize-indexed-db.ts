import { useSettings } from 'src/entities/settings'
import { useUser } from 'src/entities/user'

export const useInitializeIndexedDb = () => {
  const settings = useSettings()
  const user = useUser()

  const stores = [settings, user]
  const initializeIndexedDb = async () => {
    // eslint-disable-next-line @typescript-eslint/return-await
    return Promise.all(stores.map(async (store) => store.initialize()))
  }
  return { initializeIndexedDb }
}
