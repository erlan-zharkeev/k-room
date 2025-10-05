import { SocketActionsType } from 'common-types'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'

import { socket } from 'src/shared/api'
import { DbChatRoomType } from 'src/shared/config'

export const useAddRoom = () => {
  const { putChatRoom } = useChatRoom()
  const { contacts } = useContact()

  const monitorRoomAddition = () => {
    socket.on<SocketActionsType>('new-room-added', roomAdditionHandler)
  }

  const transformRoomData = (data: DbChatRoomType): DbChatRoomType => {
    const isPrivate = Boolean(data.chatName)
    const avatarId = `avatar.${data.users.length > 1 ? data.id : data.users[0]}`
    let chatName = data.chatName

    if (isPrivate) {
      const contactData = contacts.find((contact) => contact.id === data.users[0])
      if (contactData) {
        chatName = contactData.username
      }
    }

    return {
      ...data,
      chatName,
      avatarId
    }
  }

  const roomAdditionHandler = (data: DbChatRoomType) => {
    putChatRoom(transformRoomData(data))
  }

  return { monitorRoomAddition }
}
