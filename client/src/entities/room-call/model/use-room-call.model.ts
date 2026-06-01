import type { RoomCall } from 'global-shared'

import { db, dexieCollectionStore } from 'src/shared/lib'

const roomCallStore = dexieCollectionStore<RoomCall>(db['room-calls'])

export const useRoomCall = () => {
  const { bulkPut, mutate, put, reset } = roomCallStore
  const roomCalls = roomCallStore.use()

  return {
    roomCalls,
    bulkPut,
    mutate,
    put,
    reset
  }
}
