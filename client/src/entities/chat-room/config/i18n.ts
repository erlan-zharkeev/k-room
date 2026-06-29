import { defineI18n } from 'src/shared/lib'

export const CHAT_ROOM_I18N = defineI18n('chatRoom', {
  favoritesTitle: {
    en: 'Favorites',
    ru: 'Избранное',
    zh: 'Favorites'
  },
  supportTitle: {
    en: 'Support',
    ru: 'Поддержка',
    zh: 'Support'
  },
  supportOpenStatus: {
    en: 'Open',
    ru: 'Открыт',
    zh: 'Open'
  },
  supportClosedStatus: {
    en: 'Closed',
    ru: 'Закрыт',
    zh: 'Closed'
  }
})
