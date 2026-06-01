import type { Call } from 'global-shared'

import { db, dexieCollectionStore } from 'src/shared/lib'

const callStore = dexieCollectionStore<Call>(db.calls)

export const useCall = () => {
  const { bulkPut, put, reset } = callStore
  const calls = callStore.use()

  return {
    calls,
    bulkPut,
    put,
    reset
  }
}
