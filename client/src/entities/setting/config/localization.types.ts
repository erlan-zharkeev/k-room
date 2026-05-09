import type { AppLanguageType } from 'global-shared'

import type { DateTimeFormatType } from 'src/shared/lib'

export interface IUserLocalizationSettings {
  language: AppLanguageType
  dateTimeFormat: DateTimeFormatType
}
