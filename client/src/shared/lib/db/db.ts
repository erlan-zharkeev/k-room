import Dexie, { type Table } from 'dexie'
import type { Call, ChatRoom, Message } from 'global-shared'

import type { ContactRecord, MediaRecord, KnownUserRecord, KvItem } from './types'

export class KRoomDB extends Dexie {
  settings!: Table<KvItem<object>>
  contacts!: Table<ContactRecord>
  'known-users'!: Table<KnownUserRecord>
  media!: Table<MediaRecord>
  'chat-rooms'!: Table<ChatRoom>
  calls!: Table<Call>
  messages!: Table<Message>

  constructor() {
    super(__CLIENT_ENV_DATA__.appName.toLocaleLowerCase())
    this.version(18).stores({
      settings: '__key',
      contacts: '&id',
      'known-users': '&id',
      media: '&id',
      'chat-rooms': '&id',
      calls: '&id',
      messages: '&id'
    })
  }
}

export const db = new KRoomDB()
