import type { LocalizedTextType } from 'global-shared'

import type { DateTimeFormatType } from 'src/shared/config'

export interface ISettingsDateTimeFormatOption {
  label: LocalizedTextType<string>
  value: DateTimeFormatType
}
