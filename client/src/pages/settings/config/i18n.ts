import { defineI18n } from 'global-shared'

export const SETTINGS_PAGE_I18N = defineI18n({
  account: {
    en: 'Account',
    ru: 'Аккаунт',
    zh: '账号'
  },
  accountDescription: {
    en: 'Profile and password',
    ru: 'Профиль и пароль',
    zh: '资料和密码'
  },
  personalData: {
    en: 'Personal data',
    ru: 'Персональные данные',
    zh: '个人资料'
  },
  nickname: {
    en: 'Nickname',
    ru: 'Никнейм',
    zh: '昵称'
  },
  copyId: {
    en: 'Copy ID',
    ru: 'Скопировать ID',
    zh: '复制 ID'
  },
  copyNickname: {
    en: 'Copy nickname',
    ru: 'Скопировать никнейм',
    zh: '复制昵称'
  },
  uploadPhoto: {
    en: 'Upload photo',
    ru: 'Загрузить фото',
    zh: '上传照片'
  },
  resetPhoto: {
    en: 'Reset photo',
    ru: 'Сбросить фото',
    zh: '重置照片'
  },
  updateAccountData: {
    en: 'Update',
    ru: 'Обновить',
    zh: '更新'
  },
  changePassword: {
    en: 'Change password',
    ru: 'Изменить пароль',
    zh: '修改密码'
  },
  currentPassword: {
    en: 'Current password',
    ru: 'Текущий пароль',
    zh: '当前密码'
  },
  newPassword: {
    en: 'New password',
    ru: 'Новый пароль',
    zh: '新密码'
  },
  confirmPassword: {
    en: 'Confirm password',
    ru: 'Повторите пароль',
    zh: '确认密码'
  },
  passwordMismatch: {
    en: 'Passwords do not match',
    ru: 'Пароли не совпадают',
    zh: '两次输入的密码不一致'
  },
  theme: {
    en: 'Theme',
    ru: 'Тема',
    zh: '主题'
  },
  selectTheme: {
    en: 'Select theme',
    ru: 'Выбор темы',
    zh: '选择主题'
  },
  brandTheme: {
    en: 'Brand theme',
    ru: 'Фирменная тема',
    zh: '品牌主题'
  },
  language: {
    en: 'Language',
    ru: 'Язык',
    zh: '语言'
  },
  selectLanguage: {
    en: 'Select language',
    ru: 'Выбор языка',
    zh: '选择语言'
  },
  wallpaper: {
    en: 'Wallpaper',
    ru: 'Обои',
    zh: '壁纸'
  },
  wallpaperEnabled: {
    en: 'Show wallpaper',
    ru: 'Показывать обои',
    zh: '显示壁纸'
  },
  notifications: {
    en: 'Notifications',
    ru: 'Уведомления',
    zh: '通知'
  },
  notificationsDescription: {
    en: 'In-app notifications',
    ru: 'Уведомления внутри приложения',
    zh: '应用内通知'
  },
  sound: {
    en: 'Sound',
    ru: 'Звук',
    zh: '声音'
  },
  devices: {
    en: 'I/O Devices',
    ru: 'Устройства ввода/вывода',
    zh: '输入/输出设备'
  },
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
  },
  faq: {
    en: 'FAQ',
    ru: 'FAQ',
    zh: 'FAQ'
  },
  faqDescription: {
    en: 'Answers and help',
    ru: 'Ответы и помощь',
    zh: '答案和帮助'
  },
  faqSearch: {
    en: 'Search',
    ru: 'Поиск',
    zh: '搜索'
  },
  faqNoResults: {
    en: 'Nothing found',
    ru: 'Ничего не найдено',
    zh: '未找到结果'
  },
  faqContactSupport: {
    en: 'Contact support',
    ru: 'Написать в поддержку',
    zh: '联系客服'
  },
  faqQ1: {
    en: 'How do I change my nickname?',
    ru: 'Как изменить имя пользователя?',
    zh: '如何更改用户名？'
  },
  faqA1: {
    en: 'Go to Settings → Account. Enter a new nickname in the "Nickname" field and click "Update".',
    ru: 'Перейдите в Настройки → Аккаунт. Введите новое имя в поле «Имя пользователя» и нажмите «Обновить».',
    zh: '前往设置 → 账号，在"用户名"字段中输入新用户名，然后点击"更新"。'
  },
  faqQ2: {
    en: 'How do I change my avatar?',
    ru: 'Как изменить аватар?',
    zh: '如何更改头像？'
  },
  faqA2: {
    en: 'Go to Settings → Account. Click "Upload photo" to choose an image, or "Reset photo" to remove your current avatar.',
    ru: 'Перейдите в Настройки → Аккаунт. Нажмите «Загрузить фото», чтобы выбрать изображение, или «Сбросить фото», чтобы удалить текущий аватар.',
    zh: '前往设置 → 账号。点击"上传照片"选择图片，或点击"重置照片"删除当前头像。'
  },
  faqQ3: {
    en: 'How do I change my password?',
    ru: 'Как изменить пароль?',
    zh: '如何更改密码？'
  },
  faqA3: {
    en: 'Go to Settings → Account. Fill in the "Current password", "New password" and "Confirm password" fields, then click "Change password".',
    ru: 'Перейдите в Настройки → Аккаунт. Заполните поля «Текущий пароль», «Новый пароль» и «Повторите пароль», затем нажмите «Изменить пароль».',
    zh: '前往设置 → 账号，填写"当前密码"、"新密码"和"确认密码"字段，然后点击"修改密码"。'
  },
  faqQ4: {
    en: 'How do I switch the app language?',
    ru: 'Как переключить язык приложения?',
    zh: '如何切换应用语言？'
  },
  faqA4: {
    en: 'Go to Settings → Language and select the desired language.',
    ru: 'Перейдите в Настройки → Язык и выберите нужный язык.',
    zh: '前往设置 → 语言，选择所需语言。'
  },
  faqQ5: {
    en: 'How do I change the theme?',
    ru: 'Как изменить тему?',
    zh: '如何更改主题？'
  },
  faqA5: {
    en: 'Go to Settings → Theme and choose a colour scheme.',
    ru: 'Перейдите в Настройки → Тема и выберите цветовую схему.',
    zh: '前往设置 → 主题，选择配色方案。'
  },
  faqQ6: {
    en: 'How do I enable or disable notifications?',
    ru: 'Как включить или отключить уведомления?',
    zh: '如何启用或禁用通知？'
  },
  faqA6: {
    en: 'Go to Settings → Notifications and toggle the switch.',
    ru: 'Перейдите в Настройки → Уведомления и переключите тумблер.',
    zh: '前往设置 → 通知，切换开关。'
  },
  faqQ7: {
    en: 'How do I clear the local storage?',
    ru: 'Как очистить локальное хранилище?',
    zh: '如何清除本地存储？'
  },
  faqA7: {
    en: 'Go to Settings → Storage and click the clear button.',
    ru: 'Перейдите в Настройки → Хранилище и нажмите кнопку очистки.',
    zh: '前往设置 → 存储，点击清除按钮。'
  }
})
