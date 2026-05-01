<script setup lang="ts">
import { LanguageSelect } from 'src/features/language-select'

import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../config/i18n/appearance'
import SettingsCard from '../SettingsCard.vue'
</script>

<template>
  <div class="settings-language-content">
    <SettingsCard :title="$t(SETTINGS_PAGE_APPEARANCE_I18N.selectLanguage)">
      <LanguageSelect />
    </SettingsCard>
  </div>
</template>
