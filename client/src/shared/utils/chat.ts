import { IChatRoom, IMessage } from 'common'

export const getChatName = (room: IChatRoom | undefined) => {
  if (room === undefined) return ''
  return room.chatName === '' ? room.users[0] ?? '' : room.chatName
}

export const chatRoomUnreadMessagesCount = (chatRoom: IChatRoom, messages: IMessage[]) => {
  const roomMessageIds = new Set(chatRoom.messages)
  return messages.filter(
    (message) => roomMessageIds.has(message.id) && !message.isSelf && message.status === 'delivered'
  ).length
}
