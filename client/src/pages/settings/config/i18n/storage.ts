export const SETTINGS_PAGE_STORAGE_I18N = {
  storage: {
    en: 'Storage',
    ru: 'Хранилище',
    zh: '存储'
  },
  storageDescription: {
    en: 'Storage',
    ru: 'Хранилище',
    zh: '存储'
  },
  storageUsed: {
    en: 'Used',
    ru: 'Занято',
    zh: '已用'
  },
  storageAvailable: {
    en: 'Available',
    ru: 'Доступно',
    zh: '可用'
  },
  storageTotal: {
    en: 'Total (allocated by system)',
    ru: 'Всего (выделено системой)',
    zh: '总计（系统分配）'
  },
  storagePersistent: {
    en: 'Persistent storage',
    ru: 'Постоянное хранилище',
    zh: '持久存储'
  },
  storagePersistentDescription: {
    en: "Request the browser to protect app data from automatic cleanup. Without this, the browser may delete messages and media if the device runs low on storage or you haven't opened the app for a while.",
    ru: 'Запросить у браузера защиту данных приложения от автоматической очистки. Без этого браузер может удалить сообщения и медиафайлы, если на устройстве мало места или вы давно не заходили в приложение.',
    zh: '请求浏览器保护应用数据，防止自动清除。若不启用，当设备存储不足或长时间未使用应用时，浏览器可能会删除消息和媒体文件。'
  },
  storagePersistentGranted: {
    en: 'Granted',
    ru: 'Разрешено',
    zh: '已授权'
  },
  storagePersistentRequest: {
    en: 'Request',
    ru: 'Запросить',
    zh: '请求'
  },
  storageClearCache: {
    en: 'Clear cache',
    ru: 'Очистить кэш',
    zh: '清除缓存'
  },
  storageClearMedia: {
    en: 'Media',
    ru: 'Медиафайлы',
    zh: '媒体文件'
  },
  storageClearMediaDescription: {
    en: 'All media files downloaded to the device',
    ru: 'Все медиафайлы, загруженные на устройство',
    zh: '所有已下载到设备的媒体文件'
  },
  storageClearMessages: {
    en: 'Messages',
    ru: 'Сообщения',
    zh: '消息'
  },
  storageClearMessagesDescription: {
    en: 'Locally cached messages from all chats',
    ru: 'Локально кэшированные сообщения из всех чатов',
    zh: '所有聊天的本地缓存消息'
  },
  storageClear: {
    en: 'Clear',
    ru: 'Очистить',
    zh: '清除'
  }
} as const
