<script setup lang="ts">
import { ThemeSettingsForm } from 'src/widgets/theme-settings'

import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../config/i18n/appearance'
import { useResetCustomTheme } from '../../model/theme/use-reset-custom-theme'
import SettingsCard from '../SettingsCard.vue'

const { isSelectedThemeCustom, resetCustomTheme } = useResetCustomTheme()
</script>

<template>
  <SettingsCard
    v-if="isSelectedThemeCustom"
    :title="$t(SETTINGS_PAGE_APPEARANCE_I18N.themeColors)"
    :button-label="$t(SETTINGS_PAGE_APPEARANCE_I18N.resetTheme)"
    :on-button-click="resetCustomTheme"
  >
    <ThemeSettingsForm />
  </SettingsCard>
</template>
