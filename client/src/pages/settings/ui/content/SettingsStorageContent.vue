<script setup lang="ts">
import SettingsStorageClearCard from './storage/SettingsStorageClearCard.vue'
import SettingsStoragePersistentCard from './storage/SettingsStoragePersistentCard.vue'
import SettingsStorageUsageCard from './storage/SettingsStorageUsageCard.vue'
</script>

<template>
  <div class="settings-storage-content">
    <SettingsStorageUsageCard />
    <SettingsStoragePersistentCard />
    <SettingsStorageClearCard />
  </div>
</template>
