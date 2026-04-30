<script setup lang="ts">
import { MeterGroup } from 'primevue'
import { computed } from 'vue'

import { formatBytes, useI18n } from 'src/shared/lib'
import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_I18N } from '../../../config/i18n'
import SettingsCard from '../../SettingsCard.vue'

import type { ISettingsStorageUsageCardProps } from './types'

const props = defineProps<ISettingsStorageUsageCardProps>()
const { t } = useI18n()

const usageFormatted = computed(() => formatBytes(props.usageBytes))
const availableFormatted = computed(() => formatBytes(props.quotaBytes - props.usageBytes))
const quotaFormatted = computed(() => formatBytes(props.quotaBytes))
const meterValue = computed(() => [
  {
    label: t(SETTINGS_PAGE_I18N.storageUsed),
    value: props.usagePercent,
    color: 'var(--p-primary-color)'
  }
])
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_I18N.storage)">
    <MeterGroup :value="meterValue" :max="100" />

    <div class="settings-storage-usage-card__stats">
      <div class="settings-storage-usage-card__stat">
        <AppText size="small" :text="$t(SETTINGS_PAGE_I18N.storageUsed)" />
        <AppText color="contrast-color" :text="usageFormatted" />
      </div>
      <div class="settings-storage-usage-card__stat">
        <AppText size="small" :text="$t(SETTINGS_PAGE_I18N.storageAvailable)" />
        <AppText color="contrast-color" :text="availableFormatted" />
      </div>
      <div class="settings-storage-usage-card__stat">
        <AppText size="small" :text="$t(SETTINGS_PAGE_I18N.storageTotal)" />
        <AppText color="contrast-color" :text="quotaFormatted" />
      </div>
    </div>
  </SettingsCard>
</template>

<style lang="scss">
.settings-storage-usage-card__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.settings-storage-usage-card__stat {
  display: grid;
  gap: 2px;

  padding: 8px 10px;
  border-radius: 6px;

  background: var(--p-content-background);
}
</style>
