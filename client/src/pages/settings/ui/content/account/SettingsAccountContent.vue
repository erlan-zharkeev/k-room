<script setup lang="ts">
import SettingsChangeEmailCard from './SettingsChangeEmailCard.vue'
import SettingsChangePasswordCard from './SettingsChangePasswordCard.vue'
import SettingsPersonalDataCard from './SettingsPersonalDataCard.vue'
</script>

<template>
  <div class="settings-account-content settings-content-grid">
    <SettingsPersonalDataCard />
    <SettingsChangeEmailCard />
    <SettingsChangePasswordCard />
  </div>
</template>
