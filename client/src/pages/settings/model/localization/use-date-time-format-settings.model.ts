import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useI18n } from 'src/shared/lib'

import { SETTINGS_DATE_TIME_FORMAT_OPTIONS } from '../../config/constants/localization.constants'

export const useDateTimeFormatSettings = () => {
  const { t } = useI18n()
  const { settings, setByPath } = useSettings()
  const dateTimeFormatOptions = computed(() =>
    SETTINGS_DATE_TIME_FORMAT_OPTIONS.map(({ label, value }) => ({
      label: t(label),
      value
    }))
  )

  const changeDateTimeFormat = (value: NmorphSelectModelValueType = '') => {
    const selectedValue = Array.isArray(value) ? value[0] : value

    if (!selectedValue) return

    const option = SETTINGS_DATE_TIME_FORMAT_OPTIONS.find((item) => item.value === selectedValue)

    if (!option || option.value === settings.value.localization.dateTimeFormat) return

    void setByPath('localization.dateTimeFormat', option.value)
  }

  return {
    settings,
    dateTimeFormatOptions,
    changeDateTimeFormat
  }
}
