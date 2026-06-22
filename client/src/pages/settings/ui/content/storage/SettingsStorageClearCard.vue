<script setup lang="ts">
import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_STORAGE_I18N } from '../../../config/i18n/storage.i18n'
import { useStorageClear } from '../../../model/storage/use-storage-clear.model'
import SettingsCard from '../../SettingsCard.vue'

const { isClearingMedia, clearMedia } = useStorageClear()
</script>

<template>
  <SettingsCard
    :title="$t(SETTINGS_PAGE_STORAGE_I18N.storageClearCache)"
    :button-label="$t(SETTINGS_PAGE_STORAGE_I18N.storageClear)"
    :button-loading="isClearingMedia"
    :on-button-click="clearMedia"
  >
    <div class="settings-storage-clear-card">
      <AppText color="contrast-text" :text="$t(SETTINGS_PAGE_STORAGE_I18N.storageClearMedia)" />
      <AppText size="small" :text="$t(SETTINGS_PAGE_STORAGE_I18N.storageClearMediaDescription)" />
    </div>
  </SettingsCard>
</template>

<style lang="scss">
.settings-storage-clear-card {
  display: grid;
  gap: 2px;
  min-width: 0;
  margin-bottom: 4px;
}
</style>
