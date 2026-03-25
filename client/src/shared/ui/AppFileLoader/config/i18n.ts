import { type LocalizedTextType } from 'common-types'

export const APP_FILE_LOADER_I18N = {
  upload: {
    en: 'Upload',
    ru: 'Загрузить'
  },
  reset: {
    en: 'Reset',
    ru: 'Сбросить'
  }
} as const satisfies Record<string, LocalizedTextType>
