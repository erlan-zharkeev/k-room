import Dexie, { type Table } from 'dexie'

import { CLIENT_ENV } from 'src/shared/config'
import type {
  DbContactType,
  DbInfoNotificationType,
  DbMessageType,
  DbUserDataType,
  DbUserSettingType,
  FChatRoomType,
  IDbMedia
} from 'src/shared/config'

import type { KvItem } from './types'

export class KRoomDB extends Dexie {
  settings!: Table<KvItem<DbUserSettingType>>
  user!: Table<KvItem<DbUserDataType>>
  contacts!: Table<DbContactType>
  media!: Table<IDbMedia>
  'chat-rooms'!: Table<FChatRoomType>
  messages!: Table<DbMessageType>
  'info-notifications'!: Table<DbInfoNotificationType>

  constructor() {
    super(CLIENT_ENV.appName.toLocaleLowerCase())
    this.version(1).stores({
      settings: '__key',
      user: '__key',
      contacts: '&id',
      media: '&id',
      'chat-rooms': '&id',
      messages: '&id',
      'info-notifications': '&id'
    })
  }
}

export const db = new KRoomDB()
