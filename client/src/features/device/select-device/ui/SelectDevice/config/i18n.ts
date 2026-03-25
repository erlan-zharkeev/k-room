import { type LocalizedTextType } from 'common-types'

export const SELECT_DEVICE_I18N = {
  notAvailable: {
    en: 'Permissions were not granted or the devices were not detected.',
    ru: 'Разрешения не были выданы или устройства не обнаружены.'
  }
} as const satisfies Record<string, LocalizedTextType>
