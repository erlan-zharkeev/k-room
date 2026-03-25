import { type LocalizedTextType } from 'common-types'

export const AUDIO_INPUT_DEVICE_SELECT_I18N = {
  title: {
    en: 'Audio input device',
    ru: 'Устройство ввода звука'
  }
} as const satisfies Record<string, LocalizedTextType>
