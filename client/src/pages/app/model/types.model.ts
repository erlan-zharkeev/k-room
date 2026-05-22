import type { EventUpdateChatRoom } from 'global-shared'

export interface EventUpdateChatRoomWithId extends EventUpdateChatRoom {
  id?: string
}
