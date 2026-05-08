import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'

import { useSettings } from 'src/entities/setting'

import { SETTINGS_DATE_TIME_FORMAT_OPTIONS } from '../../config/constants/localization.constants'

export const useDateTimeFormatSettings = () => {
  const { settings, setByPath } = useSettings()

  const normalizeSelectValue = (value: NmorphSelectModelValueType) => (Array.isArray(value) ? value[0] ?? '' : value)

  const changeDateTimeFormat = (value: NmorphSelectModelValueType = '') => {
    const selectedValue = normalizeSelectValue(value)
    const option = SETTINGS_DATE_TIME_FORMAT_OPTIONS.find((item) => item.value === selectedValue)

    if (!option || option.value === settings.value.localization.dateTimeFormat) return

    void setByPath('localization.dateTimeFormat', option.value)
  }

  return {
    settings,
    changeDateTimeFormat
  }
}
