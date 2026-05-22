import { CLIENT_LANGUAGE, DEFAULT_DATE_TIME_FORMAT } from 'src/shared/lib'

import type { DeviceLocalizationSettings } from './localization.types'

export const DEFAULT_LOCALIZATION_SETTINGS: DeviceLocalizationSettings = {
  language: CLIENT_LANGUAGE,
  dateTimeFormat: DEFAULT_DATE_TIME_FORMAT
}
