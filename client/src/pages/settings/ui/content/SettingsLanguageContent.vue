<script setup lang="ts">
import { LanguageSelect } from 'src/features/language-select'

import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../config/i18n/appearance.i18n'
import SettingsCard from '../SettingsCard.vue'

import SettingsDateTimeFormatCard from './SettingsDateTimeFormatCard.vue'
</script>

<template>
  <div class="settings-language-content settings-content-grid">
    <SettingsCard :title="$t(SETTINGS_PAGE_APPEARANCE_I18N.selectLanguage)">
      <LanguageSelect />
    </SettingsCard>
    <SettingsDateTimeFormatCard />
  </div>
</template>

<style lang="scss">
.settings-language-content.settings-content-grid {
  grid-template-columns: 1fr;
}
</style>
