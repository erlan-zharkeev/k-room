import Dexie, { type Table } from 'dexie'

import { CLIENT_ENV } from 'src/shared/config'
import type {
  DbContactType,
  DbCallType,
  DbInfoNotificationType,
  DbMessageType,
  DbUserSettingType,
  FChatRoomType,
  IDbMedia
} from 'src/shared/config'

import type { KvItem } from './types'

export class KRoomDB extends Dexie {
  settings!: Table<KvItem<DbUserSettingType>>
  contacts!: Table<DbContactType>
  media!: Table<IDbMedia>
  'chat-rooms'!: Table<FChatRoomType>
  calls!: Table<DbCallType>
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
    this.version(2).stores({
      settings: '__key',
      user: '__key',
      contacts: '&id',
      media: '&id',
      'chat-rooms': '&id',
      calls: '&id',
      messages: '&id',
      'info-notifications': '&id'
    })
    this.version(3).stores({
      user: null
    })
  }
}

export const db = new KRoomDB()
