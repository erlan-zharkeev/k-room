import { CLIENT_LANGUAGE, DEFAULT_DATE_TIME_FORMAT } from 'src/shared/lib'

import type { IDeviceLocalizationSettings } from './localization.types'

export const DEFAULT_LOCALIZATION_SETTINGS: IDeviceLocalizationSettings = {
  language: CLIENT_LANGUAGE,
  dateTimeFormat: DEFAULT_DATE_TIME_FORMAT
}
