import type { RoomCall } from 'global-shared'

import type { RoomCallHistoryItem } from '../config/types'

export const resolveRoomCallParticipantQuantity = (roomCall: RoomCall) => roomCall.participants.length

export const resolveRoomCallHistoryDescription = (statusText: string, mediaKindText: string) =>
  `${statusText}, ${mediaKindText}`

export const sortRoomCallHistoryItems = (items: RoomCallHistoryItem[]) =>
  [...items].sort((current, next) => {
    if (current.isActive !== next.isActive) {
      return current.isActive ? -1 : 1
    }

    return next.calledAt - current.calledAt
  })
