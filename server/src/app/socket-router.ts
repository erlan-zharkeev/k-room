import { registerCallSocketHandlers } from 'src/modules/calls/calls.socket'
import { registerChatRoomsSocketHandlers } from 'src/modules/chat-rooms/chat-rooms.socket'
import { registerContactsSocketHandlers } from 'src/modules/contacts/contacts.socket'
import { registerInfoNotificationsSocketHandlers } from 'src/modules/info-notifications/info-notifications.socket'
import { registerMessagesSocketHandlers } from 'src/modules/messages/messages.socket'
import { registerUserSocketHandlers } from 'src/modules/user/user.socket'
import type { SocketInstanceType } from 'src/shared/types/socket'

export const socketRouter = (socket: SocketInstanceType) => {
  registerUserSocketHandlers(socket)
  registerInfoNotificationsSocketHandlers(socket)
  registerChatRoomsSocketHandlers(socket)
  registerContactsSocketHandlers(socket)
  registerMessagesSocketHandlers(socket)
  registerCallSocketHandlers(socket)
}
