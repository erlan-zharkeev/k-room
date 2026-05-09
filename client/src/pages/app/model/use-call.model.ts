import type { DbCallType } from 'src/shared/lib'
import { db, dexieCollectionStore } from 'src/shared/lib'

const callStore = dexieCollectionStore<DbCallType>(db.calls)

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
