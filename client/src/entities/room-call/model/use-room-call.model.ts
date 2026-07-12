import type { RoomCall } from 'global-shared'

import { db, dexieCollectionStore } from 'src/shared/lib'

import { mergeRoomCallSnapshot } from '../lib/room-call-sync'

const roomCallStore = dexieCollectionStore<RoomCall>(db['room-calls'])

export const useRoomCall = () => {
  const { bulkPut, get, mergeMany, mutate, put, remove, replaceAll, reset } = roomCallStore
  const roomCalls = roomCallStore.use()
  const merge = (roomCall: RoomCall) =>
    mergeMany([roomCall], {
      merge: mergeRoomCallSnapshot
    })

  return {
    roomCalls,
    bulkPut,
    get,
    merge,
    mergeMany,
    mutate,
    put,
    remove,
    replaceAll,
    reset
  }
}
