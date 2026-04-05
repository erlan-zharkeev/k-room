import { defineI18n } from 'common'

export const CREATE_CHAT_ROOM_FORM_I18N = defineI18n({
  queryPlaceholder: {
    en: 'Find contact',
    ru: 'Найти контакт'
  },
  queryLabel: {
    en: 'Filter',
    ru: 'Фильтр'
  },
  fromTitle: {
    en: (count: number) => `Pick contacts${count > 0 ? ` (${count})` : ''}`,
    ru: (count: number) => `Выбрать контакты${count > 0 ? ` (${count})` : ''}`
  },
  toTitle: {
    en: 'Chat room contacts',
    ru: 'Участники чата'
  },
  avatarLabel: {
    en: 'Chat avatar',
    ru: 'Аватар чата'
  },
  chatNamePlaceholder: {
    en: 'Type...',
    ru: 'Введите...'
  },
  chatNameLabel: {
    en: 'Chat name',
    ru: 'Название чата'
  },
  submit: {
    en: 'Create',
    ru: 'Создать'
  },
  privateChatExists: {
    en: 'A private chat with the selected contact already exists. Choose another contact or add one more.',
    ru: 'Личный чат с выбранным контактом уже существует. Выберите другой контакт или добавьте ещё одного.'
  }
})
