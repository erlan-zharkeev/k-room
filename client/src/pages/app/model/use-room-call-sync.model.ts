import type { EventRoomCallsUpdated, EventRoomCallStarted, RoomCall } from 'global-shared'

import { useRoomCall } from './use-room-call.model'

export const useRoomCallSync = () => {
  const { bulkPut, put } = useRoomCall()

  const syncRoomCalls = async (roomCalls: EventRoomCallsUpdated) => {
    await bulkPut(roomCalls)
  }

  const syncRoomCall = async (roomCall: RoomCall) => {
    await put(roomCall)
  }

  const syncStartedRoomCall = async ({ roomCall }: EventRoomCallStarted) => {
    await syncRoomCall(roomCall)
  }

  return {
    syncRoomCalls,
    syncRoomCall,
    syncStartedRoomCall
  }
}
