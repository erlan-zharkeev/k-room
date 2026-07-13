import { defineI18n } from 'global-shared'

export const CHAT_ROOMS_I18N = defineI18n({
  createChatRoomFailed: {
    en: 'Failed to create chat room',
    ru: 'Не удалось создать чат',
    zh: '创建聊天失败'
  },
  chatRoomLimitReached: {
    en: 'Chat limit reached',
    ru: 'Достигнут лимит чатов',
    zh: '已达到聊天数量限制'
  },
  pinnedChatRoomLimitReached: {
    en: 'Pinned chat limit reached',
    ru: 'Достигнут лимит закрепленных чатов',
    zh: '已达到置顶聊天数量限制'
  },
  chatRoomMemberLimitReached: {
    en: 'Group member limit reached',
    ru: 'Достигнут лимит участников группы',
    zh: '已达到群组成员数量限制'
  },
  chatRoomNameTooLong: {
    en: 'Chat name is too long',
    ru: 'Название чата слишком длинное',
    zh: '聊天名称过长'
  },
  chatRoomNameRequired: {
    en: 'Chat name is required',
    ru: 'Укажите название чата',
    zh: '请输入聊天名称'
  },
  chatRoomMemberRequired: {
    en: 'Select at least one group member',
    ru: 'Выберите хотя бы одного участника группы',
    zh: '请至少选择一名群组成员'
  },
  updateChatRoomFailed: {
    en: 'Failed to update chat room',
    ru: 'Не удалось обновить чат',
    zh: '更新聊天失败'
  },
  openSupportChatFailed: {
    en: 'Failed to open support chat',
    ru: 'Не удалось открыть чат поддержки',
    zh: '无法打开支持聊天'
  },
  closeSupportChatFailed: {
    en: 'Failed to close support chat',
    ru: 'Не удалось закрыть чат поддержки',
    zh: '无法关闭支持聊天'
  },
  closeSupportChatForbidden: {
    en: 'Only the chat owner or an administrator can close support chats',
    ru: 'Закрыть чат поддержки может только владелец чата или администратор',
    zh: '只有聊天所有者或管理员可以关闭支持聊天'
  },
  updatePinnedChatRoomFailed: {
    en: 'Failed to update pinned chat room',
    ru: 'Не удалось обновить закрепление чата',
    zh: '更新置顶聊天失败'
  },
  updateMutedChatRoomFailed: {
    en: 'Failed to update muted chat room',
    ru: 'Не удалось обновить уведомления чата',
    zh: '更新聊天通知设置失败'
  },
  deleteChatRoomFailed: {
    en: 'Failed to delete chat room',
    ru: 'Не удалось удалить чат',
    zh: '删除聊天失败'
  },
  leaveChatRoomFailed: {
    en: 'Failed to leave chat room',
    ru: 'Не удалось выйти из чата',
    zh: '退出聊天失败'
  }
})
