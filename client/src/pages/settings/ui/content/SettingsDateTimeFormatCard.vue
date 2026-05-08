<script setup lang="ts">
import { NmorphSelect } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { useI18n } from 'src/shared/lib'

import { SETTINGS_DATE_TIME_FORMAT_OPTIONS } from '../../config/constants/localization.constants'
import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../config/i18n/appearance.i18n'
import { useDateTimeFormatSettings } from '../../model/localization/use-date-time-format-settings'
import SettingsCard from '../SettingsCard.vue'

const { t } = useI18n()
const { settings, changeDateTimeFormat } = useDateTimeFormatSettings()
const dateTimeFormatOptions = computed(() =>
  SETTINGS_DATE_TIME_FORMAT_OPTIONS.map(({ label, value }) => ({
    label: t(label),
    value
  }))
)
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_APPEARANCE_I18N.dateTimeFormat)">
    <NmorphSelect
      :key="settings.localization.dateTimeFormat"
      :aria-label="$t(SETTINGS_PAGE_APPEARANCE_I18N.selectDateTimeFormat)"
      :model-value="settings.localization.dateTimeFormat"
      :options="dateTimeFormatOptions"
      value-required
      fill
      @update:model-value="changeDateTimeFormat"
    />
  </SettingsCard>
</template>
