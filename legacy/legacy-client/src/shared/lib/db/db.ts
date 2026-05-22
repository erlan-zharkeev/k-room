import Dexie, { Table } from 'dexie'

import { CLIENT_ENV, DbUserSetting, DbContact, DbMedia, DbUserData, DbMessage, FChatRoom } from 'src/shared/config'

export class KRoomDB extends Dexie {
  settings!: Table<DbUserSetting & { __key: string }>
  user!: Table<DbUserData & { __key: string }>
  contacts!: Table<DbContact>
  media!: Table<DbMedia>
  'chat-rooms'!: Table<FChatRoom>
  messages!: Table<DbMessage>

  constructor() {
    super(CLIENT_ENV.appName.toLocaleLowerCase())
    this.version(2).stores({
      settings: '__key',
      user: '__key',
      contacts: '&id',
      media: '&id',
      'chat-rooms': '&id',
      messages: '&id'
    })
  }
}

export const db = new KRoomDB()
