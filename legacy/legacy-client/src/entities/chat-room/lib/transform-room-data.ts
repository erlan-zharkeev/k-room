import { FChatRoom } from 'src/shared/config'

export const transformRoomData = (data: FChatRoom): FChatRoom => {
  const avatarId = `avatar.${data.users.length > 1 ? data.id : data.users[0]}`

  return {
    ...data,
    avatarId
  }
}
