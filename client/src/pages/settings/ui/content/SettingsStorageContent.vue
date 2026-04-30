<script setup lang="ts">
import { useSettingsStorageCard } from '../../model/storage/use-settings-storage-card'
import SettingsStorageClearCard from './storage/SettingsStorageClearCard.vue'
import SettingsStoragePersistentCard from './storage/SettingsStoragePersistentCard.vue'
import SettingsStorageUsageCard from './storage/SettingsStorageUsageCard.vue'

const {
  usageBytes,
  quotaBytes,
  usagePercent,
  isPersistenceSupported,
  isPersistent,
  isClearingMedia,
  requestPersistence,
  clearMedia
} = useSettingsStorageCard()
</script>

<template>
  <div class="settings-storage-content">
    <SettingsStorageUsageCard
      :usage-bytes="usageBytes"
      :quota-bytes="quotaBytes"
      :usage-percent="usagePercent"
    />

    <SettingsStoragePersistentCard
      v-if="isPersistenceSupported"
      :is-persistent="isPersistent"
      @request="requestPersistence"
    />

    <SettingsStorageClearCard
      :is-clearing-media="isClearingMedia"
      @clear-media="clearMedia"
    />
  </div>
</template>

<style lang="scss">
.settings-storage-content {
  display: grid;
  gap: 12px;
  align-content: start;
}
</style>
