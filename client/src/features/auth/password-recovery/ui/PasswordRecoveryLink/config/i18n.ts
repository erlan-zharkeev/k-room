import { type LocalizedTextType } from 'common-types'

export const PASSWORD_RECOVERY_LINK_TEXT = {
  link: {
    en: 'Password recovery',
    ru: 'Восстановление пароля'
  }
} as const satisfies Record<string, LocalizedTextType>
