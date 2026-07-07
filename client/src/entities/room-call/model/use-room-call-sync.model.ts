import type {
  EventRoomCallEnded,
  EventRoomCallDeclined,
  EventRoomCallJoined,
  EventRoomCallLeft,
  EventRoomCallMediaStateUpdated,
  EventRoomCallStarted,
  EventRoomCallsUpdated,
  RoomCall
} from 'global-shared'

import {
  applyRoomCallSnapshot,
  applyRoomCallEnded,
  applyRoomCallJoined,
  applyRoomCallLeft,
  applyRoomCallMediaStateUpdated
} from '../lib/room-call-sync'

import { useRoomCall } from './use-room-call.model'

export const useRoomCallSync = () => {
  const { get, mutate, put, remove, replaceAll } = useRoomCall()

  const syncRoomCalls = async (roomCalls: EventRoomCallsUpdated) => {
    await replaceAll(roomCalls)
  }

  const syncRoomCall = async (incomingRoomCall: RoomCall) => {
    const roomCall = await get(incomingRoomCall.id)

    if (!roomCall) {
      await put(incomingRoomCall)
      return
    }

    await mutate(incomingRoomCall.id, (roomCall) => {
      applyRoomCallSnapshot(roomCall, incomingRoomCall)
    })
  }

  const syncStartedRoomCall = async ({ roomCall }: EventRoomCallStarted) => {
    await syncRoomCall(roomCall)
  }

  const syncJoinedRoomCall = async (payload: EventRoomCallJoined) => {
    const roomCall = await get(payload.roomCallId)

    if (!roomCall) {
      await put(payload.roomCall)
      return
    }

    await mutate(payload.roomCallId, (roomCall) => {
      applyRoomCallJoined(roomCall, payload)
    })
  }

  const syncLeftRoomCall = async (payload: EventRoomCallLeft) => {
    await mutate(payload.roomCallId, (roomCall) => {
      applyRoomCallLeft(roomCall, payload)
    })
  }

  const syncDeclinedRoomCall = async (payload: EventRoomCallDeclined) => {
    await remove(payload.roomCallId)
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
    syncDeclinedRoomCall,
    syncLeftRoomCall,
    syncEndedRoomCall,
    syncRoomCallMediaStateUpdated
  }
}
