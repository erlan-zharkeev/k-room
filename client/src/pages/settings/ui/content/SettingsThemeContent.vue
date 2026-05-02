<script setup lang="ts">
import SettingsThemeCard from './SettingsThemeCard.vue'
import SettingsWallpaperCard from './SettingsWallpaperCard.vue'
</script>

<template>
  <div class="settings-theme-content">
    <SettingsThemeCard />
    <SettingsWallpaperCard />
  </div>
</template>

<style lang="scss">
.settings-theme-content {
  display: grid;
  gap: 12px;
  align-content: start;
}
</style>
