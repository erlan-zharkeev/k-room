import type { RoomCall } from 'global-shared'

export const sortCallActivityPanelRoomCalls = (roomCalls: RoomCall[]) =>
  [...roomCalls].sort((left, right) => right.calledAt - left.calledAt)
