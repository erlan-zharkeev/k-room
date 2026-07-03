<script setup lang="ts">
import { NmorphText, NmorphProgress } from '@nmorph/nmorph-ui-kit'

import { SETTINGS_PAGE_STORAGE_I18N } from '../../../config/i18n/storage.i18n'
import { useStorageUsage } from '../../../model/storage/use-storage-usage.model'
import SettingsCard from '../../SettingsCard.vue'

const { availableFormatted, isStorageUsageWarning, quotaFormatted, usageFormatted, usagePercent } = useStorageUsage()
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_STORAGE_I18N.storage)" :has-warning="isStorageUsageWarning">
    <div class="settings-storage-usage-card__progress">
      <NmorphProgress :percentage="usagePercent" :max="100" />
    </div>

    <div class="settings-storage-usage-card__stats">
      <div class="settings-storage-usage-card__stat">
        <NmorphText variant="body-small">{{ $t(SETTINGS_PAGE_STORAGE_I18N.storageUsed) }}</NmorphText>
        <NmorphText color="var(--nmorph-contrast-text-color)">{{ usageFormatted }}</NmorphText>
      </div>
      <div class="settings-storage-usage-card__stat">
        <NmorphText variant="body-small">{{ $t(SETTINGS_PAGE_STORAGE_I18N.storageAvailable) }}</NmorphText>
        <NmorphText color="var(--nmorph-contrast-text-color)">{{ availableFormatted }}</NmorphText>
      </div>
      <div class="settings-storage-usage-card__stat">
        <NmorphText align="center" variant="body-small">{{ $t(SETTINGS_PAGE_STORAGE_I18N.storageTotal) }}</NmorphText>
        <NmorphText color="var(--nmorph-contrast-text-color)">{{ quotaFormatted }}</NmorphText>
      </div>
    </div>
  </SettingsCard>
</template>

<style lang="scss" scoped>
.settings-storage-usage-card__progress {
  padding-right: 12px;
  padding-left: 12px;
}

.settings-storage-usage-card__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  align-items: start;

  padding-right: 12px;
  padding-left: 12px;
}

.settings-storage-usage-card__stat {
  @include flex-column-center;
}
</style>
