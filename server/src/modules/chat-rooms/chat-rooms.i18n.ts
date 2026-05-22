import { defineI18n } from 'global-shared'

export const CHAT_ROOMS_I18N = defineI18n({
  createChatRoomFailed: {
    en: 'Failed to create chat room',
    ru: 'Не удалось создать чат',
    zh: '创建聊天失败'
  },
  chatRoomLimitReached: {
    en: 'Chat limit reached',
    ru: 'Chat limit reached',
    zh: 'Chat limit reached'
  },
  pinnedChatRoomLimitReached: {
    en: 'Pinned chat limit reached',
    ru: 'Pinned chat limit reached',
    zh: 'Pinned chat limit reached'
  },
  chatRoomMemberLimitReached: {
    en: 'Group member limit reached',
    ru: 'Group member limit reached',
    zh: 'Group member limit reached'
  },
  chatRoomNameTooLong: {
    en: 'Chat name is too long',
    ru: 'Chat name is too long',
    zh: 'Chat name is too long'
  },
  updatePinnedChatRoomFailed: {
    en: 'Failed to update pinned chat room',
    ru: 'Failed to update pinned chat room',
    zh: 'Failed to update pinned chat room'
  },
  deleteChatRoomFailed: {
    en: 'Failed to delete chat room',
    ru: 'Failed to delete chat room',
    zh: 'Failed to delete chat room'
  },
  leaveChatRoomFailed: {
    en: 'Failed to leave chat room',
    ru: 'Failed to leave chat room',
    zh: 'Failed to leave chat room'
  },
  leaveChatRoomNewAdminRequired: {
    en: 'Select a new group administrator',
    ru: 'Select a new group administrator',
    zh: 'Select a new group administrator'
  },
  leaveChatRoomInvalidNewAdmin: {
    en: 'Selected administrator is not a group member',
    ru: 'Selected administrator is not a group member',
    zh: 'Selected administrator is not a group member'
  }
})
