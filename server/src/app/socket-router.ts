import { registerCallSocketHandlers } from 'src/modules/calls/calls.socket'
import { registerChatRoomsSocketHandlers } from 'src/modules/chat-rooms/chat-rooms.socket'
import { registerContactsSocketHandlers } from 'src/modules/contacts/contacts.socket'
import { registerMessagesSocketHandlers } from 'src/modules/messages/messages.socket'
import type { PresenceService } from 'src/modules/presence/presence.service'
import { registerUserSocketHandlers } from 'src/modules/user/user.socket'
import type { SocketInstance } from 'src/shared/types/socket'

export const socketRouter = (socket: SocketInstance, presenceService: PresenceService) => {
  registerUserSocketHandlers(socket, presenceService)
  registerChatRoomsSocketHandlers(socket, presenceService)
  registerContactsSocketHandlers(socket, presenceService)
  registerMessagesSocketHandlers(socket)
  registerCallSocketHandlers(socket)
}
