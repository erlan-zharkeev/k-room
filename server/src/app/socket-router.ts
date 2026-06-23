import { Injectable } from '@nestjs/common'

import { ChatRoomsSocketService } from 'src/modules/chat-rooms/chat-rooms.socket'
import { ContactsSocketService } from 'src/modules/contacts/contacts.socket'
import { MessagesSocketService } from 'src/modules/messages/messages.socket'
import { RoomCallsSocketService } from 'src/modules/room-calls/room-calls.socket'
import { UserSocketService } from 'src/modules/user/user.socket'
import type { SocketInstance } from 'src/shared/types'

@Injectable()
export class SocketRouter {
  constructor(
    private readonly userSocketService: UserSocketService,
    private readonly chatRoomsSocketService: ChatRoomsSocketService,
    private readonly contactsSocketService: ContactsSocketService,
    private readonly messagesSocketService: MessagesSocketService,
    private readonly roomCallsSocketService: RoomCallsSocketService
  ) {}

  async register(socket: SocketInstance) {
    await this.userSocketService.register(socket)
    this.chatRoomsSocketService.register(socket)
    this.contactsSocketService.register(socket)
    this.messagesSocketService.register(socket)
    this.roomCallsSocketService.register(socket)
  }
}
