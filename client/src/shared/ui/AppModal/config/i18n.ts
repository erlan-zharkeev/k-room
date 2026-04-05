import { LocalizedTextMapType } from 'common'

export const APP_MODAL_I18N = {
  ok: {
    en: 'OK',
    ru: 'ОК'
  },
  close: {
    en: 'Close dialog',
    ru: 'Закрыть диалог'
  },
  cancel: {
    en: 'Cancel',
    ru: 'Отмена'
  }
} as const satisfies LocalizedTextMapType
