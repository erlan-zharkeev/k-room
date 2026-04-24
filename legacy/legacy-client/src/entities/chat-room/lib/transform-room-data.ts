import { FChatRoomType } from 'src/shared/config'

export const transformRoomData = (data: FChatRoomType): FChatRoomType => {
  const avatarId = `avatar.${data.users.length > 1 ? data.id : data.users[0]}`

  return {
    ...data,
    avatarId
  }
}
