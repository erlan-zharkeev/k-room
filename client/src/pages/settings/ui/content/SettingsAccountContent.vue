<script setup lang="ts">
import SettingsChangeEmailCard from './account/SettingsChangeEmailCard.vue'
import SettingsChangePasswordCard from './account/SettingsChangePasswordCard.vue'
import SettingsPersonalDataCard from './account/SettingsPersonalDataCard.vue'
</script>

<template>
  <div class="settings-account-content">
    <SettingsPersonalDataCard />
    <SettingsChangeEmailCard />
    <SettingsChangePasswordCard />
  </div>
</template>

<style lang="scss">
.settings-account-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
  padding: 16px;
}
</style>
