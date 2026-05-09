import type { LocalizedTextType } from 'global-shared'

import type { DateTimeFormatType } from 'src/shared/lib'

export interface ISettingsDateTimeFormatOption {
  label: LocalizedTextType<string>
  value: DateTimeFormatType
}
