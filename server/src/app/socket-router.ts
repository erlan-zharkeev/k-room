import { Injectable } from '@nestjs/common'

import { CallsSocketService } from 'src/modules/calls/calls.socket'
import { ChatRoomsSocketService } from 'src/modules/chat-rooms/chat-rooms.socket'
import { ContactsSocketService } from 'src/modules/contacts/contacts.socket'
import { MessagesSocketService } from 'src/modules/messages/messages.socket'
import { UserSocketService } from 'src/modules/user/user.socket'
import type { SocketInstance } from 'src/shared/types'

@Injectable()
export class SocketRouter {
  constructor(
    private readonly userSocketService: UserSocketService,
    private readonly chatRoomsSocketService: ChatRoomsSocketService,
    private readonly contactsSocketService: ContactsSocketService,
    private readonly messagesSocketService: MessagesSocketService,
    private readonly callsSocketService: CallsSocketService
  ) {}

  register(socket: SocketInstance) {
    this.userSocketService.register(socket)
    this.chatRoomsSocketService.register(socket)
    this.contactsSocketService.register(socket)
    this.messagesSocketService.register(socket)
    this.callsSocketService.register(socket)
  }
}
