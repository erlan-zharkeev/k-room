<script setup lang="ts">
import SettingsDateTimeFormatCard from './SettingsDateTimeFormatCard.vue'
import SettingsSelectLanguageCard from './SettingsSelectLanguageCard.vue'
</script>

<template>
  <div class="settings-localization-content settings-content-grid settings-content-grid--compact-cards">
    <SettingsSelectLanguageCard />
    <SettingsDateTimeFormatCard />
  </div>
</template>
