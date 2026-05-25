import { defineI18n } from 'global-shared'

export const CHAT_ROOM_CONTEXT_MENU_I18N = defineI18n({
  createChat: {
    en: 'Create chat',
    ru: 'Создать чат',
    zh: '创建聊天'
  },
  openChat: {
    en: 'Open chat',
    ru: 'Открыть чат',
    zh: '打开聊天'
  },
  chatActions: {
    en: 'Chat actions',
    ru: 'Действия чата',
    zh: '聊天操作'
  },
  markAsRead: {
    en: 'Mark as read',
    ru: 'Отметить прочитанным',
    zh: '标为已读'
  },
  pinChat: {
    en: 'Pin chat',
    ru: 'Закрепить чат',
    zh: '置顶聊天'
  },
  unpinChat: {
    en: 'Unpin chat',
    ru: 'Открепить чат',
    zh: '取消置顶'
  },
  muteChat: {
    en: 'Mute chat',
    ru: 'Выключить уведомления',
    zh: '静音聊天'
  },
  unmuteChat: {
    en: 'Unmute chat',
    ru: 'Включить уведомления',
    zh: '取消静音'
  },
  editGroup: {
    en: 'Edit group',
    ru: 'Редактировать группу',
    zh: '编辑群组'
  },
  deleteChat: {
    en: 'Delete chat',
    ru: 'Удалить чат',
    zh: '删除聊天'
  },
  deleteChatTitle: {
    en: 'Delete chat',
    ru: 'Удалить чат',
    zh: '删除聊天'
  },
  deleteChatConfirm: {
    en: 'Are you sure you want to delete this chat?',
    ru: 'Вы уверены, что хотите удалить этот чат?',
    zh: '确定要删除此聊天吗？'
  },
  deletePrivateChatConfirm: {
    en: 'This action is irreversible. The chat and all messages will be deleted for both participants.',
    ru: 'Это действие необратимо. Чат и все сообщения будут удалены у обоих участников.',
    zh: '此操作无法撤销。聊天和所有消息将从双方删除。'
  },
  leaveGroup: {
    en: 'Leave group',
    ru: 'Покинуть группу',
    zh: '退出群组'
  },
  leaveGroupTitle: {
    en: 'Leave group',
    ru: 'Покинуть группу',
    zh: '退出群组'
  },
  leaveGroupConfirm: {
    en: 'Are you sure you want to leave this group?',
    ru: 'Вы уверены, что хотите покинуть эту группу?',
    zh: '确定要退出此群组吗？'
  },
  leaveGroupAdminConfirm: {
    en: 'Choose a new administrator before leaving this group.',
    ru: 'Выберите нового администратора перед выходом из группы.',
    zh: '退出群组前请选择新的管理员。'
  },
  newGroupAdministrator: {
    en: 'New administrator',
    ru: 'Новый администратор',
    zh: '新管理员'
  },
  createChatTitle: {
    en: 'New chat',
    ru: 'Новый чат',
    zh: '新聊天'
  },
  editGroupTitle: {
    en: 'Edit group',
    ru: 'Редактирование группы',
    zh: '编辑群组'
  },
  saveChat: {
    en: 'Save',
    ru: 'Сохранить',
    zh: '保存'
  },
  chatName: {
    en: 'Chat name',
    ru: 'Название чата',
    zh: '聊天名称'
  },
  chatNameTooLong: {
    en: 'Chat name is too long',
    ru: 'Название чата слишком длинное',
    zh: '聊天名称过长'
  },
  uploadChatImage: {
    en: 'Upload chat image',
    ru: 'Загрузить изображение чата',
    zh: '上传聊天图片'
  },
  chatImageInvalidFormat: {
    en: 'Only image files are supported',
    ru: 'Поддерживаются только изображения',
    zh: '仅支持图片文件'
  },
  chatImageInvalidSize: {
    en: (size: number) => `Chat image must be less than ${size} MB`,
    ru: (size: number) => `Изображение чата должно быть меньше ${size} МБ`,
    zh: (size: number) => `聊天图片必须小于 ${size} MB`
  },
  chatImageReadFailed: {
    en: 'Failed to prepare chat image',
    ru: 'Не удалось подготовить изображение чата',
    zh: '无法准备聊天图片'
  },
  contactSearch: {
    en: 'Search contacts',
    ru: 'Поиск контактов',
    zh: '搜索联系人'
  },
  noContacts: {
    en: 'No accepted contacts',
    ru: 'Нет подтвержденных контактов',
    zh: '暂无已接受的联系人'
  },
  noContactSearchResults: {
    en: 'No contacts found',
    ru: 'Контакты не найдены',
    zh: '未找到联系人'
  },
  cancel: {
    en: 'Cancel',
    ru: 'Отмена',
    zh: '取消'
  }
})
