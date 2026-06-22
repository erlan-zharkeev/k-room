import { defineI18n } from 'src/shared/lib'

export const SETTINGS_PAGE_ROADMAP_I18N = defineI18n('settingsPageRoadmap', {
  roadmap: {
    en: 'Roadmap',
    ru: 'Планы',
    zh: '路线图'
  },
  roadmapDescription: {
    en: 'What is coming next',
    ru: 'Что появится дальше',
    zh: '接下来会推出的功能'
  },
  intro: {
    en: 'These are the improvements we are preparing for the next versions. The list may change as we refine the product, but it shows the direction clearly.',
    ru: 'Здесь собраны улучшения, которые мы готовим для следующих версий. Список может меняться по мере развития продукта, но показывает общее направление.',
    zh: '这里列出了我们正在为后续版本准备的改进。随着产品打磨，列表可能会调整，但它展示了清晰的方向。'
  },
  statusPlanned: {
    en: 'Planned',
    ru: 'В плане',
    zh: '已计划'
  },
  statusDesign: {
    en: 'In design',
    ru: 'Проектируем',
    zh: '设计中'
  },
  statusResearch: {
    en: 'Researching',
    ru: 'Исследуем',
    zh: '调研中'
  },
  scheduledMessagesTitle: {
    en: 'Scheduled messages',
    ru: 'Отложенная отправка сообщений',
    zh: '定时发送消息'
  },
  scheduledMessagesDescription: {
    en: 'Choose the exact time for a message to be sent, prepare reminders in advance, and keep the draft visible until it leaves.',
    ru: 'Можно будет выбрать точное время отправки, заранее подготовить напоминание или важное сообщение и видеть его в чате до момента отправки.',
    zh: '可以为消息选择精确发送时间，提前准备提醒或重要内容，并在发送前持续看到这条草稿。'
  },
  audioMessagesTitle: {
    en: 'Audio messages',
    ru: 'Аудиосообщения',
    zh: '语音消息'
  },
  audioMessagesDescription: {
    en: 'Record a short voice message directly from the composer and send it without opening the file picker.',
    ru: 'Короткое голосовое сообщение можно будет записать прямо из поля ввода и отправить без выбора файла.',
    zh: '可以直接在输入框中录制简短语音消息并发送，无需打开文件选择器。'
  },
  cameraCaptureTitle: {
    en: 'Fast camera capture',
    ru: 'Быстрая съемка с камеры',
    zh: '快速相机拍摄'
  },
  cameraCaptureDescription: {
    en: 'Attach a fresh photo or video directly from the camera without first saving it to the gallery or file picker.',
    ru: 'Фото или видео можно будет сделать прямо из поля вложений, без промежуточного сохранения в галерею и выбора файла вручную.',
    zh: '可以直接从附件区域拍摄照片或视频，无需先保存到图库或再手动选择文件。'
  },
  secureChatsTitle: {
    en: 'Private encrypted spaces',
    ru: 'Защищенные чаты с e2e encryption',
    zh: '端到端加密私密空间'
  },
  secureChatsDescription: {
    en: 'Special limited chats with stronger privacy guarantees, separate creation rules, and end-to-end encryption for sensitive conversations.',
    ru: 'Появятся специальные чаты с ограниченным количеством, отдельными правилами создания и сквозным шифрованием для действительно приватных разговоров.',
    zh: '将推出数量受限的特殊聊天，带有独立创建规则，并为敏感对话提供端到端加密。'
  },
  logoutAllDevicesTitle: {
    en: 'Sign out on all devices',
    ru: 'Выход на всех устройствах',
    zh: '退出所有设备'
  },
  logoutAllDevicesDescription: {
    en: 'End every active session for the account from settings, so lost or old devices stop keeping access.',
    ru: 'Можно будет завершить все активные сессии аккаунта из настроек, чтобы потерянные или старые устройства больше не сохраняли доступ.',
    zh: '可以在设置中结束账号的所有活动会话，让丢失或旧设备不再保留访问权限。'
  },
  messageDraftsTitle: {
    en: 'Full message drafts',
    ru: 'Полноценные черновики сообщений',
    zh: '完整消息草稿'
  },
  messageDraftsDescription: {
    en: 'Each chat will keep its own draft, and draft state will be able to follow you across devices so unfinished thoughts do not disappear.',
    ru: 'У каждого чата будет свой черновик, а состояние черновиков сможет синхронизироваться между устройствами, чтобы незаконченные мысли не терялись.',
    zh: '每个聊天都会保留自己的草稿，并可在设备之间同步，让未完成的内容不会丢失。'
  },
  audioActivityTitle: {
    en: 'Audio activity indicator',
    ru: 'Индикатор активности аудио',
    zh: '音频活动指示器'
  },
  audioActivityDescription: {
    en: 'Calls will show whether audio activity is present even when the microphone is muted, making device and connection issues easier to notice.',
    ru: 'Во время звонков будет видно, есть ли аудиоактивность даже при выключенном микрофоне, чтобы проще замечать проблемы с устройством или соединением.',
    zh: '通话中即使麦克风关闭，也会显示是否存在音频活动，帮助更快发现设备或连接问题。'
  },
  granularStorageCleanupTitle: {
    en: 'Flexible storage cleanup',
    ru: 'Гибкая очистка кэша хранилища',
    zh: '灵活的存储清理'
  },
  granularStorageCleanupDescription: {
    en: 'Clear cached media by category, such as audio, video, images, documents and other downloaded files, instead of removing the whole cache at once.',
    ru: 'Кэш можно будет очищать по категориям: аудио, видео, изображения, документы и другие загруженные файлы, не удаляя весь кэш сразу.',
    zh: '可以按类别清理缓存媒体，例如音频、视频、图片、文档和其他已下载文件，而不是一次性删除全部缓存。'
  },
  conferenceRecordingTitle: {
    en: 'Conference recording',
    ru: 'Запись видеоконференций',
    zh: '会议录制'
  },
  conferenceRecordingDescription: {
    en: 'Record important video meetings and save the result in a predictable place with clear participant awareness and access rules.',
    ru: 'Важные видеовстречи можно будет записывать и сохранять в понятном месте с прозрачным уведомлением участников и правилами доступа.',
    zh: '可以录制重要视频会议，并将结果保存在清晰的位置，同时明确告知参与者并遵守访问规则。'
  },
  supportChatTitle: {
    en: 'Built-in support chat',
    ru: 'Полноценный чат поддержки',
    zh: '内置支持聊天'
  },
  supportChatDescription: {
    en: 'Contact support from inside the app, keep the conversation history, and attach screenshots or files when a problem needs context.',
    ru: 'В поддержку можно будет написать прямо из приложения, сохранить историю обращения и прикрепить скриншоты или файлы, если проблеме нужен контекст.',
    zh: '可以直接在应用内联系支持，保留沟通历史，并在问题需要上下文时附加截图或文件。'
  }
})
