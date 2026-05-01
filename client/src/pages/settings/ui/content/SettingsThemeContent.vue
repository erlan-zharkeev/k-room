<script setup lang="ts">
import { ThemeSettings } from 'src/widgets/theme-settings'

import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../config/i18n/appearance'
import { useSettingsThemeCard } from '../../model/theme/use-settings-theme-card'
import SettingsCard from '../SettingsCard.vue'

import SettingsWallpaperCard from './SettingsWallpaperCard.vue'

const { settings, changeCustomThemeColor } = useSettingsThemeCard()
</script>

<template>
  <div class="settings-theme-content">
    <SettingsCard :title="$t(SETTINGS_PAGE_APPEARANCE_I18N.selectTheme)">
      <ThemeSettings
        :theme="settings.theme"
        :custom-theme="settings.customTheme"
        @change-custom-theme-color="changeCustomThemeColor"
      />
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
