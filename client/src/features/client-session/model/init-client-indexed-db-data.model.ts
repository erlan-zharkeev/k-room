import { initializeMediaCacheTrimmer } from 'src/entities/media-file'
import { useSettings } from 'src/entities/setting'
import { initializeDexieCollectionStores, openDexieDatabase } from 'src/shared/lib'

let clientIndexedDbInitPromise: Promise<void> | null = null

const initializeClientIndexedDbData = async () => {
  const settingsStore = useSettings()

  initializeMediaCacheTrimmer()
  await openDexieDatabase()
  await Promise.all([settingsStore.initialize(), initializeDexieCollectionStores()])
}

export const initClientIndexedDbData = () => {
  if (clientIndexedDbInitPromise == null) {
    clientIndexedDbInitPromise = initializeClientIndexedDbData()
  }

  return clientIndexedDbInitPromise
}
