import type {
  EventRoomCallEnded,
  EventRoomCallJoined,
  EventRoomCallLeft,
  EventRoomCallMediaStateUpdated,
  EventRoomCallStarted,
  EventRoomCallsUpdated,
  RoomCall
} from 'global-shared'

import {
  applyRoomCallEnded,
  applyRoomCallJoined,
  applyRoomCallLeft,
  applyRoomCallMediaStateUpdated
} from '../lib/room-call-sync'

import { useRoomCall } from './use-room-call.model'

export const useRoomCallSync = () => {
  const { bulkPut, mutate, put } = useRoomCall()

  const syncRoomCalls = async (roomCalls: EventRoomCallsUpdated) => {
    await bulkPut(roomCalls)
  }

  const syncRoomCall = async (roomCall: RoomCall) => {
    await put(roomCall)
  }

  const syncStartedRoomCall = async ({ roomCall }: EventRoomCallStarted) => {
    await syncRoomCall(roomCall)
  }

  const syncJoinedRoomCall = async (payload: EventRoomCallJoined) => {
    await mutate(payload.roomCallId, (roomCall) => {
      applyRoomCallJoined(roomCall, payload)
    })
  }

  const syncLeftRoomCall = async (payload: EventRoomCallLeft) => {
    await mutate(payload.roomCallId, (roomCall) => {
      applyRoomCallLeft(roomCall, payload)
    })
  }

  const syncEndedRoomCall = async (payload: EventRoomCallEnded) => {
    await mutate(payload.roomCallId, (roomCall) => {
      applyRoomCallEnded(roomCall, payload)
    })
  }

  const syncRoomCallMediaStateUpdated = async (payload: EventRoomCallMediaStateUpdated) => {
    await mutate(payload.roomCallId, (roomCall) => {
      applyRoomCallMediaStateUpdated(roomCall, payload)
    })
  }

  return {
    syncRoomCalls,
    syncRoomCall,
    syncStartedRoomCall,
    syncJoinedRoomCall,
    syncLeftRoomCall,
    syncEndedRoomCall,
    syncRoomCallMediaStateUpdated
  }
}
