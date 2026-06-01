import type { RoomCall } from 'global-shared'

export const resolveRoomCallActiveParticipantQuantity = (roomCall: RoomCall) =>
  roomCall.participants.filter(({ leftAt }) => !leftAt).length
