<script setup lang="ts">
import { ThemeSettings } from 'src/widgets/theme-settings'

import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../config/i18n/appearance'
import SettingsCard from '../SettingsCard.vue'

import SettingsWallpaperCard from './SettingsWallpaperCard.vue'
</script>

<template>
  <div class="settings-theme-content">
    <SettingsCard :title="$t(SETTINGS_PAGE_APPEARANCE_I18N.theme)">
      <ThemeSettings />
    </SettingsCard>
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
