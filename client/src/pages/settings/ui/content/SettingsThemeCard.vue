<script setup lang="ts">
import { useSettings } from 'src/entities/setting'
import { ThemeSettingsForm } from 'src/widgets/theme-settings'

import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../config/i18n/appearance'
import SettingsCard from '../SettingsCard.vue'

const { isSelectedThemeCustom } = useSettings()
</script>

<template>
  <SettingsCard v-if="isSelectedThemeCustom" :title="$t(SETTINGS_PAGE_APPEARANCE_I18N.themeColors)">
    <ThemeSettingsForm />
  </SettingsCard>
</template>
