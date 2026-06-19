import { SETTINGS_PAGE_APPEARANCE_I18N } from '../i18n/appearance.i18n'
import type { SettingsDateTimeFormatOption } from '../types/localization.types'

export const SETTINGS_DATE_TIME_FORMAT_OPTIONS: SettingsDateTimeFormatOption[] = [
  {
    label: SETTINGS_PAGE_APPEARANCE_I18N.dateTimeFormatAuto,
    value: 'auto'
  },
  {
    label: SETTINGS_PAGE_APPEARANCE_I18N.dateTimeFormatDmyDot24h,
    value: 'dmy-dot-24h'
  },
  {
    label: SETTINGS_PAGE_APPEARANCE_I18N.dateTimeFormatMdySlash12h,
    value: 'mdy-slash-12h'
  },
  {
    label: SETTINGS_PAGE_APPEARANCE_I18N.dateTimeFormatDmySlash24h,
    value: 'dmy-slash-24h'
  },
  {
    label: SETTINGS_PAGE_APPEARANCE_I18N.dateTimeFormatYmdDash24h,
    value: 'ymd-dash-24h'
  }
]
