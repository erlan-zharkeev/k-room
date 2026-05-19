import { defineI18n } from 'global-shared'

export const CHAT_ROOM_PAGE_I18N = defineI18n({
  roomsTitle: {
    en: 'Chats',
    ru: 'Chats',
    zh: 'Chats'
  },
  search: {
    en: 'Search chat',
    ru: 'Search chat',
    zh: 'Search chat'
  },
  createChat: {
    en: 'Create chat',
    ru: 'Create chat',
    zh: 'Create chat'
  },
  createChatTitle: {
    en: 'New chat',
    ru: 'New chat',
    zh: 'New chat'
  },
  chatName: {
    en: 'Chat name',
    ru: 'Chat name',
    zh: 'Chat name'
  },
  uploadChatImage: {
    en: 'Upload chat image',
    ru: 'Upload chat image',
    zh: 'Upload chat image'
  },
  chatImageInvalidFormat: {
    en: 'Only image files are supported',
    ru: 'Only image files are supported',
    zh: 'Only image files are supported'
  },
  chatImageInvalidSize: {
    en: (size: number) => `Chat image must be less than ${size} MB`,
    ru: (size: number) => `Chat image must be less than ${size} MB`,
    zh: (size: number) => `Chat image must be less than ${size} MB`
  },
  chatImageReadFailed: {
    en: 'Failed to prepare chat image',
    ru: 'Failed to prepare chat image',
    zh: 'Failed to prepare chat image'
  },
  contactSearch: {
    en: 'Search contacts',
    ru: 'Search contacts',
    zh: 'Search contacts'
  },
  contacts: {
    en: 'Contacts',
    ru: 'Contacts',
    zh: 'Contacts'
  },
  privateChatExists: {
    en: 'Private chat already exists',
    ru: 'Private chat already exists',
    zh: 'Private chat already exists'
  },
  noContacts: {
    en: 'No accepted contacts',
    ru: 'No accepted contacts',
    zh: 'No accepted contacts'
  },
  noContactSearchResults: {
    en: 'No contacts found',
    ru: 'No contacts found',
    zh: 'No contacts found'
  },
  noChats: {
    en: 'There are no chats yet',
    ru: 'There are no chats yet',
    zh: 'There are no chats yet'
  },
  noSearchResults: {
    en: 'No chats found',
    ru: 'No chats found',
    zh: 'No chats found'
  },
  noRoomSelected: {
    en: 'Select a chat to start messaging',
    ru: 'Select a chat to start messaging',
    zh: 'Select a chat to start messaging'
  },
  noMessages: {
    en: 'No messages yet',
    ru: 'No messages yet',
    zh: 'No messages yet'
  },
  loadingMessages: {
    en: 'Loading messages',
    ru: 'Loading messages',
    zh: 'Loading messages'
  },
  loadOlderMessages: {
    en: 'Load older messages',
    ru: 'Load older messages',
    zh: 'Load older messages'
  },
  messagePlaceholder: {
    en: 'Message',
    ru: 'Message',
    zh: 'Message'
  },
  attachFile: {
    en: 'Attach file',
    ru: 'Attach file',
    zh: 'Attach file'
  },
  selectEmoji: {
    en: 'Select emoji',
    ru: 'Select emoji',
    zh: 'Select emoji'
  },
  sendMessage: {
    en: 'Send message',
    ru: 'Send message',
    zh: 'Send message'
  },
  typing: {
    en: 'typing',
    ru: 'typing',
    zh: 'typing'
  },
  cancel: {
    en: 'Cancel',
    ru: 'Cancel',
    zh: 'Cancel'
  }
})
