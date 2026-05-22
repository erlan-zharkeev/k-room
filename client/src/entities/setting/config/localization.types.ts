import type { AppLanguage } from 'global-shared'

import type { DateTimeFormat } from 'src/shared/lib'

export interface DeviceLocalizationSettings {
  language: AppLanguage
  dateTimeFormat: DateTimeFormat
}
