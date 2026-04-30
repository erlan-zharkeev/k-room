<script setup lang="ts">
import { ThemeSettings } from 'src/widgets/theme-settings'

import { SETTINGS_PAGE_I18N } from '../../config/i18n'
import { useSettingsThemeCard } from '../../model/theme/use-settings-theme-card'
import SettingsCard from '../SettingsCard.vue'

const { theme, customTheme, changeTheme, changeCustomThemeColor } = useSettingsThemeCard()
</script>

<template>
  <div class="settings-theme-content">
    <SettingsCard :title="$t(SETTINGS_PAGE_I18N.selectTheme)">
      <ThemeSettings
        :theme="theme"
        :custom-theme="customTheme"
        @change-theme="changeTheme"
        @change-custom-theme-color="changeCustomThemeColor"
      />
    </SettingsCard>
  </div>
</template>

<style lang="scss">
.settings-theme-content {
  display: grid;
  gap: 12px;
  align-content: start;
}
</style>
