<script setup lang="ts">
import SettingsStorageClearCard from './SettingsStorageClearCard.vue'
import SettingsStoragePersistentCard from './SettingsStoragePersistentCard.vue'
import SettingsStorageUsageCard from './SettingsStorageUsageCard.vue'
</script>

<template>
  <div class="settings-storage-content settings-content-grid">
    <SettingsStorageUsageCard />
    <SettingsStoragePersistentCard />
    <SettingsStorageClearCard />
  </div>
</template>
