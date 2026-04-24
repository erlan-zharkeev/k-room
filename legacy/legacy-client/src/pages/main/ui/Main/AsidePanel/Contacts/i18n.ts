import { defineI18n } from 'common'

export const CONTACTS_WIDGET_I18N = defineI18n({
  title: {
    en: 'Contacts',
    ru: 'Контакты'
  }
})

export const CONTACT_SHARED_I18N = defineI18n({
  online: {
    en: 'online',
    ru: 'в сети'
  },
  lastSeen: {
    en: 'last seen',
    ru: 'был(а) в сети'
  }
})

export const CONTACT_INVITATION_CONTROL_BTNS_I18N = defineI18n({
  updatingStatus: {
    en: 'Updating status',
    ru: 'Обновление статуса'
  },
  sendInvite: {
    en: 'Send invite',
    ru: 'Пригласить'
  },
  invited: {
    en: 'Invited',
    ru: 'Пригласить'
  },
  accept: {
    en: 'Accept',
    ru: 'Принять'
  },
  decline: {
    en: 'Decline',
    ru: 'Отклонить'
  },
  hide: {
    en: 'Hide',
    ru: 'Скрыть'
  }
})

export const DELETE_CONTACT_I18N = defineI18n({
  modalTitle: {
    en: 'Delete contact',
    ru: 'Удалить контакт'
  },
  confirmText: {
    en: 'Are you sure you want to delete this contact?',
    ru: 'Вы уверены, что хотите удалить этот контакт?'
  },
  confirm: {
    en: 'Delete',
    ru: 'Удалить'
  }
})

export const SEARCH_CONTACT_I18N = defineI18n({
  placeholder: {
    en: 'Search contact',
    ru: 'Поиск контакта'
  },
  found: {
    en: (count: number) => `Found ${count} contacts`,
    ru: (count: number) => `Найдено контактов: ${count}`
  },
  loadingMore: {
    en: 'Loading',
    ru: 'Загрузка'
  }
})

export const CONTACT_ACTIONS_I18N = defineI18n({
  call: {
    en: 'Call',
    ru: 'Позвонить'
  },
  createChat: {
    en: 'Create chat',
    ru: 'Создать чат'
  },
  creatingChat: {
    en: 'Creating chat',
    ru: 'Создание чата'
  },
  text: {
    en: 'Text',
    ru: 'Написать'
  },
  delete: {
    en: 'Delete',
    ru: 'Удалить'
  },
  empty: {
    en: 'There are no contacts yet',
    ru: 'Пока нет контактов'
  }
})
