import { Module } from '@nestjs/common'

import { CallsSocketService } from 'src/modules/calls/calls.socket'
import { ChatRoomsSocketService } from 'src/modules/chat-rooms/chat-rooms.socket'
import { ContactsSocketService } from 'src/modules/contacts/contacts.socket'
import { MessagesSocketService } from 'src/modules/messages/messages.socket'
import { PresenceModule } from 'src/modules/presence/presence.module'
import { SecurityModule } from 'src/modules/security/security.module'
import { UserModule } from 'src/modules/user/user.module'
import { UserSocketService } from 'src/modules/user/user.socket'

import { SocketRouter } from './socket-router'
import { SocketService } from './socket.service'

@Module({
  imports: [PresenceModule, SecurityModule, UserModule],
  providers: [
    SocketService,
    SocketRouter,
    UserSocketService,
    ChatRoomsSocketService,
    ContactsSocketService,
    MessagesSocketService,
    CallsSocketService
  ]
})
export class SocketModule {}
