import type { IEventUpdateChatRoom } from 'global-shared'

export interface IEventUpdateChatRoomWithId extends IEventUpdateChatRoom {
  id?: string
}
