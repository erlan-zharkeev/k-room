import type { RoomCall } from 'global-shared'

import type { BuildRoomCallActivityTextParams } from '../config/types'

export const resolveActiveRoomCallParticipantQuantity = ({ participants }: RoomCall) =>
  participants.filter(({ leftAt }) => !leftAt).length

export const buildRoomCallActivityText = ({
  isPrivateRoom,
  participantText,
  text
}: BuildRoomCallActivityTextParams) => {
  if (isPrivateRoom) {
    return text
  }

  return `${text}, ${participantText}`
}
