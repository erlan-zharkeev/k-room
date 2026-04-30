<script setup lang="ts">
import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_I18N } from '../../../config/i18n'
import SettingsCard from '../../SettingsCard.vue'

defineProps<{
  isPersistent: boolean
}>()

const emit = defineEmits<{
  request: []
}>()
</script>

<template>
  <SettingsCard
    :title="$t(SETTINGS_PAGE_I18N.storagePersistent)"
    :button-label="isPersistent ? undefined : $t(SETTINGS_PAGE_I18N.storagePersistentRequest)"
    :on-button-click="isPersistent ? undefined : () => emit('request')"
  >
    <AppText :text="$t(SETTINGS_PAGE_I18N.storagePersistentDescription)" />
    <AppText
      v-if="isPersistent"
      color="accent-color"
      :text="$t(SETTINGS_PAGE_I18N.storagePersistentGranted)"
    />
  </SettingsCard>
</template>
