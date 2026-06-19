<script setup lang="ts">
import { NmorphSelect } from '@nmorph/nmorph-ui-kit'

import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../../config/i18n/appearance.i18n'
import { useDateTimeFormatSettings } from '../../../model/localization/use-date-time-format-settings.model'
import SettingsCard from '../../SettingsCard.vue'

const { settings, dateTimeFormatOptions, changeDateTimeFormat } = useDateTimeFormatSettings()
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
