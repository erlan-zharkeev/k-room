import type { KnownUserRecordType } from 'src/shared/lib'
import { db, dexieCollectionStore } from 'src/shared/lib'

const knownUserStore = dexieCollectionStore<KnownUserRecordType>(db['known-users'])

export const useKnownUser = () => {
  const { bulkPut, get, mergeMany, put, remove, reset, update } = knownUserStore
  const { items: knownUsers, itemMap: knownUserById } = knownUserStore.useIndexedList()

  return {
    knownUsers,
    knownUserById,
    get,
    put,
    bulkPut,
    update,
    remove,
    mergeMany,
    reset
  }
}
