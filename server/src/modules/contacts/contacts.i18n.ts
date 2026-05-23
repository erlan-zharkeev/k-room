import { defineI18n } from 'global-shared'

export const CONTACTS_I18N = defineI18n({
  saveContactFailed: {
    en: 'Failed to save contact',
    ru: 'Не удалось сохранить контакт',
    zh: '保存联系人失败'
  },
  contactLimitReached: {
    en: 'Contact limit reached',
    ru: 'Contact limit reached',
    zh: 'Contact limit reached'
  },
  searchQueryTooLong: {
    en: 'Search query is too long',
    ru: 'Search query is too long',
    zh: 'Search query is too long'
  },
  searchContactFailed: {
    en: 'Failed to search contacts',
    ru: 'Не удалось выполнить поиск контактов',
    zh: '搜索联系人失败'
  },
  updateContactInteractionFailed: {
    en: 'Failed to update contact interaction',
    ru: 'Не удалось обновить взаимодействие с контактом',
    zh: '更新联系人交互失败'
  },
  invitationRestricted: {
    en: 'User restricted invitations',
    ru: 'User restricted invitations',
    zh: 'User restricted invitations'
  }
})
