import type { AppLanguageType } from 'global-shared'

import type { DateTimeFormatType } from 'src/shared/lib'

export interface IDeviceLocalizationSettings {
  language: AppLanguageType
  dateTimeFormat: DateTimeFormatType
}
