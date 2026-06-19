<script setup lang="ts">
import { SelectLanguage } from 'src/features/select-language'

import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../../config/i18n/appearance.i18n'
import SettingsCard from '../../SettingsCard.vue'
</script>
<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_APPEARANCE_I18N.selectLanguage)">
    <SelectLanguage />
  </SettingsCard>
</template>
