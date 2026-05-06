import { useSettings } from 'src/entities/setting'
import { db, initializeDexieCollectionStores } from 'src/shared/lib'

let clientIndexedDbInitPromise: Promise<void> | null = null

const initializeClientIndexedDbData = async () => {
  const settingsStore = useSettings()

  await db.open()
  await Promise.all([settingsStore.initialize(), initializeDexieCollectionStores()])
}

export const initClientIndexedDbData = () => {
  if (clientIndexedDbInitPromise == null) {
    clientIndexedDbInitPromise = initializeClientIndexedDbData()
  }

  return clientIndexedDbInitPromise
}
