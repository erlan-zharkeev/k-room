import { type LocalizedTextType } from 'common-types'

export const CALL_MODAL_BODY_I18N = {
  outgoingCall: {
    en: 'Outgoing call',
    ru: 'Исходящий звонок'
  },
  incomingCall: {
    en: 'Incoming call',
    ru: 'Входящий звонок'
  },
  isCalling: {
    en: 'is calling',
    ru: 'звонит'
  },
  acceptCall: {
    en: 'Accept call',
    ru: 'Принять звонок'
  },
  declineCall: {
    en: 'Decline call',
    ru: 'Отклонить звонок'
  }
} as const satisfies Record<string, LocalizedTextType>
