import type { IChatRoom } from 'global-shared'

import type { FChatRoomType } from 'src/shared/lib'

import { isRoomPrivate } from './is-room-private'

export const transformRoomData = (data: IChatRoom): FChatRoomType => {
  const avatarId = `avatar.${isRoomPrivate(data) ? data.users[0] : data.id}`

  return {
    ...data,
    avatarId
  }
}
