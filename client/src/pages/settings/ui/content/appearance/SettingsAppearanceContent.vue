<script setup lang="ts">
import { ThemeSelect } from 'src/features/theme-select'

import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../../config/i18n/appearance.i18n'
import SettingsCard from '../../SettingsCard.vue'

import SettingsThemeCard from './SettingsThemeCard.vue'
import SettingsWallpaperCard from './SettingsWallpaperCard.vue'
</script>

<template>
  <div class="settings-appearance-content settings-content-grid">
    <SettingsCard :title="$t(SETTINGS_PAGE_APPEARANCE_I18N.theme)">
      <ThemeSelect />
    </SettingsCard>
    <SettingsThemeCard />
    <SettingsWallpaperCard />
  </div>
</template>
