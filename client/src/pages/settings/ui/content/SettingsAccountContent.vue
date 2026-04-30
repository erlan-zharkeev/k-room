<script setup lang="ts">
import SettingsChangePasswordCard from './account/SettingsChangePasswordCard.vue'
import SettingsPersonalDataCard from './account/SettingsPersonalDataCard.vue'
</script>

<template>
  <div class="settings-account-content">
    <SettingsPersonalDataCard />
    <SettingsChangePasswordCard />
  </div>
</template>

<style lang="scss">
.settings-account-content {
  display: grid;
  gap: 12px;
  align-content: start;
}
</style>
