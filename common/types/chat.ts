export interface IChatRoom {
  id: string
  authorId: string
  chatName?: string
  lastMessageId: string | null
  users: string[]
  messages: string[]
}

export type ChatRoomsType = IChatRoom[]

export interface IChatRoomSchema extends Omit<IChatRoom, 'users' | 'lastMessageId'> {
  users: string[]
}
