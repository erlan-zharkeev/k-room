import type { KnownUserRecordType } from 'src/shared/lib'
import { db, dexieCollectionStore } from 'src/shared/lib'

const knownUserStore = dexieCollectionStore<KnownUserRecordType>(db['known-users'])

export const useKnownUser = () => {
  const { bulkPut, get, mergeMany, put, remove, reset, update } = knownUserStore
  const { items: knownUsers, getByIds } = knownUserStore.useIndexedList()

  return {
    knownUsers,
    getByIds,
    get,
    put,
    bulkPut,
    update,
    remove,
    mergeMany,
    reset
  }
}
