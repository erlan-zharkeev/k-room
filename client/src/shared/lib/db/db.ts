import Dexie, { type Table } from 'dexie'
import type { ChatRoom, Message, RoomCall } from 'global-shared'

import type { ContactRecord, MediaRecord, KnownUserRecord, KvItem } from './types'

export class KRoomDB extends Dexie {
  settings!: Table<KvItem<object>>
  contacts!: Table<ContactRecord>
  'known-users'!: Table<KnownUserRecord>
  media!: Table<MediaRecord>
  'chat-rooms'!: Table<ChatRoom>
  'room-calls'!: Table<RoomCall>
  messages!: Table<Message>

  constructor() {
    super(__CLIENT_ENV_DATA__.appName.toLocaleLowerCase())
    this.version(19).stores({
      settings: '__key',
      contacts: '&id',
      'known-users': '&id',
      media: '&id',
      'chat-rooms': '&id',
      calls: null,
      'room-calls': '&id',
      messages: '&id'
    })
  }
}

export const db = new KRoomDB()
