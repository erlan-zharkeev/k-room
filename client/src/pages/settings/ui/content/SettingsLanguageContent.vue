<script setup lang="ts">
import { LanguageSelect } from 'src/features/language-select'

import { SETTINGS_PAGE_I18N } from '../../config/i18n'
import SettingsCard from '../SettingsCard.vue'
</script>

<template>
  <div class="settings-language-content">
    <SettingsCard :title="$t(SETTINGS_PAGE_I18N.selectLanguage)">
      <LanguageSelect />
    </SettingsCard>
  </div>
</template>
