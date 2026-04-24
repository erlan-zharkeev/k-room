import type { IChatRoom } from 'global-shared'

import type { FChatRoomType } from 'src/shared/config'

export const transformRoomData = (data: IChatRoom): FChatRoomType => {
  const avatarId = `avatar.${data.users.length > 1 ? data.id : data.users[0]}`

  return {
    ...data,
    avatarId
  }
}
