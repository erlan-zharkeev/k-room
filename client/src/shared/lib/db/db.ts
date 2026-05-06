import Dexie, { type Table } from 'dexie'

import { CLIENT_ENV } from 'src/shared/config'
import { DEFAULT_NOTIFICATION_SETTINGS } from 'src/shared/config'
import type {
  DbContactType,
  DbCallType,
  DbInfoNotificationType,
  DbMessageType,
  DbUserSettingType,
  IUserSettingMigration,
  FChatRoomType,
  IDbMedia
} from 'src/shared/config'

import type { KvItem } from './types'

const buildNotificationSettings = ({ showNotification, soundOn }: IUserSettingMigration) => {
  const group = { ...DEFAULT_NOTIFICATION_SETTINGS.general, toast: showNotification, sound: soundOn }

  return {
    ...DEFAULT_NOTIFICATION_SETTINGS,
    general: { ...group },
    messages: { ...group },
    calls: { ...group }
  }
}

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
    this.version(7).stores({
      settings: '__key',
      contacts: '&id',
      media: '&id',
      'chat-rooms': '&id',
      calls: '&id',
      messages: '&id',
      'info-notifications': '&id'
    })

    this.version(8)
      .stores({
        settings: '__key',
        contacts: '&id',
        media: '&id',
        'chat-rooms': '&id',
        calls: '&id',
        messages: '&id',
        'info-notifications': '&id'
      })
      .upgrade(async (transaction) => {
        const settings = transaction.table<KvItem<IUserSettingMigration>, string>('settings')
        const current = await settings.get('settings')

        if (!current || current.notifications) return

        await settings.put({
          ...current,
          notifications: buildNotificationSettings(current)
        })
      })
  }
}

export const db = new KRoomDB()
