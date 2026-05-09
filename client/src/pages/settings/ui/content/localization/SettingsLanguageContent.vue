<script setup lang="ts">
import SettingsDateTimeFormatCard from './SettingsDateTimeFormatCard.vue'
import SettingsLanguageSelectCard from './SettingsLanguageSelectCard.vue'
</script>

<template>
  <div class="settings-language-content settings-content-grid settings-content-grid--compact-cards">
    <SettingsLanguageSelectCard />
    <SettingsDateTimeFormatCard />
  </div>
</template>
