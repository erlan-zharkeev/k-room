import { DbChatRoomType } from 'src/shared/config'

export const transformRoomData = (data: DbChatRoomType): DbChatRoomType => {
  const avatarId = `avatar.${data.users.length > 1 ? data.id : data.users[0]}`

  return {
    ...data,
    avatarId
  }
}
