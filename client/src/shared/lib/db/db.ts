import Dexie, { type Table } from 'dexie'

import {
  CLIENT_ENV,
  CUSTOM_WALLPAPER_SETTINGS,
  DEFAULT_DARK_WALLPAPER_FILENAME,
  DEFAULT_DARK_WALLPAPER_URL,
  DEFAULT_LIGHT_WALLPAPER_FILENAME,
  DEFAULT_LIGHT_WALLPAPER_URL,
  DEFAULT_THEME_SHADOW_SETTINGS,
  EFFECTIVE_THEME_VALUES
} from 'src/shared/config'
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
    this.version(5).stores({
      settings: '__key',
      contacts: '&id',
      media: '&id',
      'chat-rooms': '&id',
      calls: '&id',
      messages: '&id',
      'info-notifications': '&id'
    })
    this.version(6)
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
        const settings = transaction.table<KvItem<DbUserSettingType>>('settings')
        const data = await settings.get('settings')

        if (!data) return

        EFFECTIVE_THEME_VALUES.forEach((theme) => {
          const themeData = data.appearance.themes[theme]

          themeData.darkShadeGeneratorCoefficient ??= DEFAULT_THEME_SHADOW_SETTINGS.darkShadeGeneratorCoefficient
          themeData.lightShadeGeneratorCoefficient ??= DEFAULT_THEME_SHADOW_SETTINGS.lightShadeGeneratorCoefficient
          themeData.baseShadowWidth ??= DEFAULT_THEME_SHADOW_SETTINGS.baseShadowWidth
          themeData.baseShadowBlurCoefficient ??= DEFAULT_THEME_SHADOW_SETTINGS.baseShadowBlurCoefficient
          themeData.colorSchema.scrollThumb ??= themeData.colorSchema.text
        })

        await settings.put(data)
      })
    this.version(7)
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
        const settings = transaction.table<KvItem<DbUserSettingType>>('settings')
        const data = await settings.get('settings')

        if (!data) return

        const { wallpaper } = data.appearance.themes.custom
        const presetUrls = [DEFAULT_DARK_WALLPAPER_URL, DEFAULT_LIGHT_WALLPAPER_URL]
        const presetFilenames = [DEFAULT_DARK_WALLPAPER_FILENAME, DEFAULT_LIGHT_WALLPAPER_FILENAME]

        if (!presetUrls.includes(wallpaper.url) && !presetFilenames.includes(wallpaper.filename)) return

        data.appearance.themes.custom.wallpaper = { ...CUSTOM_WALLPAPER_SETTINGS }

        await settings.put(data)
      })
  }
}

export const db = new KRoomDB()
