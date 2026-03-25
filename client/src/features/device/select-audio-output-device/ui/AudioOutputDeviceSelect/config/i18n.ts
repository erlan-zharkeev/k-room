import { type LocalizedTextType } from 'common-types'

export const AUDIO_OUTPUT_DEVICE_SELECT_I18N = {
  title: {
    en: 'Audio output device',
    ru: 'Устройство вывода звука'
  }
} as const satisfies Record<string, LocalizedTextType>
