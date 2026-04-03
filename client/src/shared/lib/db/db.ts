import Dexie, { Table } from 'dexie'

import {
  DbUserSettingType,
  DbContactType,
  IDbMedia,
  DbUserDataType,
  DbMessageType,
  FChatRoomType
} from 'src/shared/config'

export class KRoomDB extends Dexie {
  settings!: Table<DbUserSettingType & { __key: string }>
  user!: Table<DbUserDataType & { __key: string }>
  contacts!: Table<DbContactType>
  media!: Table<IDbMedia>
  'chat-rooms'!: Table<FChatRoomType>
  messages!: Table<DbMessageType>

  constructor() {
    super('k-room')
    this.version(1).stores({
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
