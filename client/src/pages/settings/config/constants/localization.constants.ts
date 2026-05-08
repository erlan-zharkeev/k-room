import { DATE_TIME_FORMAT } from 'src/shared/config'

import { SETTINGS_PAGE_APPEARANCE_I18N } from '../i18n/appearance.i18n'
import type { ISettingsDateTimeFormatOption } from '../types/localization.types'

export const SETTINGS_DATE_TIME_FORMAT_OPTIONS: ISettingsDateTimeFormatOption[] = [
  {
    label: SETTINGS_PAGE_APPEARANCE_I18N.dateTimeFormatAuto,
    value: DATE_TIME_FORMAT.auto
  },
  {
    label: SETTINGS_PAGE_APPEARANCE_I18N.dateTimeFormatDmyDot24h,
    value: DATE_TIME_FORMAT.dmyDot24h
  },
  {
    label: SETTINGS_PAGE_APPEARANCE_I18N.dateTimeFormatMdySlash12h,
    value: DATE_TIME_FORMAT.mdySlash12h
  },
  {
    label: SETTINGS_PAGE_APPEARANCE_I18N.dateTimeFormatDmySlash24h,
    value: DATE_TIME_FORMAT.dmySlash24h
  },
  {
    label: SETTINGS_PAGE_APPEARANCE_I18N.dateTimeFormatYmdDash24h,
    value: DATE_TIME_FORMAT.ymdDash24h
  }
]
