import type { RoomCall } from 'global-shared'

export const sortCallStatusRoomCalls = (roomCalls: RoomCall[]) =>
  [...roomCalls].sort((left, right) => right.calledAt - left.calledAt)
