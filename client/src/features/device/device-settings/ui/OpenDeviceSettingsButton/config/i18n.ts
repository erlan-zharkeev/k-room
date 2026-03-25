import { type LocalizedTextType } from 'common-types'

export const OPEN_DEVICE_SETTINGS_BUTTON_I18N = {
  tooltip: {
    en: 'Device settings',
    ru: 'Настройки устройств'
  },
  modalTitle: {
    en: 'Device settings',
    ru: 'Настройки устройств'
  }
} as const satisfies Record<string, LocalizedTextType>
