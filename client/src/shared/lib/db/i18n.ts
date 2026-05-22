import { defineI18n } from 'global-shared'

export const DB_QUOTA_I18N = defineI18n({
  cacheTrimmed: {
    en: 'Storage was full. Local cache was reduced. Some files may reload.',
    ru: 'Хранилище было заполнено. Локальный кэш уменьшен, некоторые файлы могут загрузиться заново.',
    zh: '存储空间已满。已减少本地缓存，部分文件可能会重新加载。'
  },
  cacheTrimFailed: {
    en: 'Storage is full. Free up space or clear the app cache.',
    ru: 'Хранилище заполнено. Освободите место или очистите кэш приложения.',
    zh: '存储空间已满。请释放空间或清除应用缓存。'
  }
})
