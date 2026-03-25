import { type LocalizedTextType } from 'common-types'

export const DONT_SHOW_NOTIFICATION_AGAIN_BTN_I18N = {
  button: {
    en: "Don't show again",
    ru: 'Больше не показывать'
  }
} as const satisfies Record<string, LocalizedTextType>
