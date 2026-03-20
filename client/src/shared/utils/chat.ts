import { IChatRoom, IMessage } from 'common-types'

export const getChatName = (room: IChatRoom | undefined) => {
  if (room === undefined) return ''
  return room.chatName === '' ? room.users[0].username : room.chatName
}

export const chatRoomLastMessageBody = (chatRoom: IChatRoom): string => {
  const { messages } = chatRoom
  if (!messages) return ''
  return messages[messages.length - 1]?.body ?? ''
}

export const chatRoomUnreadMessagesCount = (chatRoom: IChatRoom, messages: IMessage[]) => {
  const roomMessageIds = new Set(chatRoom.messages)
  return messages.filter((message) => roomMessageIds.has(message.id) && !message.isSelf && message.status === 'delivered').length
}
