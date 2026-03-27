import { type LocalizedTextMapType } from 'common'

export const CONTACT_INVITATION_CONTROL_BTNS_I18N = {
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
} as const satisfies LocalizedTextMapType
