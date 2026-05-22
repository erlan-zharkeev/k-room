import type { LocalizedText } from 'global-shared'

import type { DateTimeFormat } from 'src/shared/lib'

export interface SettingsDateTimeFormatOption {
  label: LocalizedText<string>
  value: DateTimeFormat
}
