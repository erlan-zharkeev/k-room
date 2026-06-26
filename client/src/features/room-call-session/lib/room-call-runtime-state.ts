import type { RoomCallUserFlagByUserId } from '../config/types'

export const toggleRoomCallUserFlag = (state: RoomCallUserFlagByUserId, userId: string): RoomCallUserFlagByUserId => {
  if (!state[userId]) {
    return {
      ...state,
      [userId]: true
    }
  }

  const { [userId]: _removedUserFlag, ...nextState } = state

  return nextState
}
