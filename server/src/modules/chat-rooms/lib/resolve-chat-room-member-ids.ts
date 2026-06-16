import { getRoomOtherUserIds } from 'global-shared'

export const resolveChatRoomMemberIds = (userId: string, memberIds: string[]) => [
  userId,
  ...getRoomOtherUserIds({ users: memberIds }, userId)
]
