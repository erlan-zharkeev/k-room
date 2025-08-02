import { useSettings } from 'src/entities/settings'

export const useInitializeIndexedDb = () => {
  const settings = useSettings()

  const stores = [settings]
  const initializeIndexedDb = async () => {
    // eslint-disable-next-line @typescript-eslint/return-await
    return Promise.all(stores.map(async (store) => store.initialize()))
  }
  return { initializeIndexedDb }
}
