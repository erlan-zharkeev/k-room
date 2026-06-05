import type { RoomCall } from 'global-shared'

export const sortRoomCallActivityRoomCalls = (roomCalls: RoomCall[]) =>
  [...roomCalls].sort((left, right) => right.calledAt - left.calledAt)
