import { useI18n } from '../i18n/i18n'

import { buildMediaDeviceSelectOptions as buildRawMediaDeviceSelectOptions } from './device-selection'
import { MEDIA_DEVICE_I18N } from './i18n'
import type { BuildMediaDeviceSelectOptionsParams } from './types'

export const useMediaDeviceSelectOptions = () => {
  const { t } = useI18n()

  const buildMediaDeviceSelectOptions = (params: Omit<BuildMediaDeviceSelectOptionsParams, 'unknownOptionLabel'>) =>
    buildRawMediaDeviceSelectOptions({
      ...params,
      unknownOptionLabel: t(MEDIA_DEVICE_I18N.unknownDevice)
    })

  return {
    buildMediaDeviceSelectOptions
  }
}
