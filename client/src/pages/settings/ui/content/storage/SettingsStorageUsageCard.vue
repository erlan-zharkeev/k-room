<script setup lang="ts">
import { NmorphProgress } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_STORAGE_I18N } from '../../../config/i18n/storage.i18n'
import { useStorageUsage } from '../../../model/storage/use-storage-usage.model'
import SettingsCard from '../../SettingsCard.vue'

const { availableFormatted, isStorageUsageWarning, quotaFormatted, usageFormatted, usagePercent } = useStorageUsage()
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_STORAGE_I18N.storage)" :has-warning="isStorageUsageWarning">
    <NmorphProgress :percentage="usagePercent" :max="100" />

    <div class="settings-storage-usage-card__stats">
      <div class="settings-storage-usage-card__stat">
        <AppText size="small" :text="$t(SETTINGS_PAGE_STORAGE_I18N.storageUsed)" />
        <AppText color="contrast-text" :text="usageFormatted" />
      </div>
      <div class="settings-storage-usage-card__stat">
        <AppText size="small" :text="$t(SETTINGS_PAGE_STORAGE_I18N.storageAvailable)" />
        <AppText color="contrast-text" :text="availableFormatted" />
      </div>
      <div class="settings-storage-usage-card__stat">
        <AppText alignment="center" size="small" :text="$t(SETTINGS_PAGE_STORAGE_I18N.storageTotal)" />
        <AppText color="contrast-text" :text="quotaFormatted" />
      </div>
    </div>
  </SettingsCard>
</template>

<style lang="scss">
.settings-storage-usage-card__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  align-items: start;

  margin-right: 24px;
}

.settings-storage-usage-card__stat {
  @include flex-column-center;
}
</style>
