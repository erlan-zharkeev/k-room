import { Module } from '@nestjs/common'

import { ChatRoomsSocketService } from 'src/modules/chat-rooms/chat-rooms.socket'
import { ContactsSocketService } from 'src/modules/contacts/contacts.socket'
import { MessagesSocketService } from 'src/modules/messages/messages.socket'
import { NotificationsModule } from 'src/modules/notifications/notifications.module'
import { PresenceModule } from 'src/modules/presence/presence.module'
import { RoomCallsSocketService } from 'src/modules/room-calls/room-calls.socket'
import { SecurityModule } from 'src/modules/security/security.module'
import { UserModule } from 'src/modules/user/user.module'
import { UserSocketService } from 'src/modules/user/user.socket'

import { SocketRouter } from './socket-router'
import { SocketService } from './socket.service'

@Module({
  imports: [NotificationsModule, PresenceModule, SecurityModule, UserModule],
  providers: [
    SocketService,
    SocketRouter,
    UserSocketService,
    ChatRoomsSocketService,
    ContactsSocketService,
    MessagesSocketService,
    RoomCallsSocketService
  ]
})
export class SocketModule {}
