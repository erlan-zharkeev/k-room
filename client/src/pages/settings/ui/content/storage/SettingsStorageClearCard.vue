<script setup lang="ts">
import { Button } from 'primevue'

import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_I18N } from '../../../config/i18n'
import SettingsCard from '../../SettingsCard.vue'

defineProps<{
  isClearingMedia: boolean
}>()

defineEmits<{
  clearMedia: []
}>()
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_I18N.storageClearCache)">
    <div class="settings-storage-clear-card__row">
      <div class="settings-storage-clear-card__info">
        <AppText color="contrast-color" :text="$t(SETTINGS_PAGE_I18N.storageClearMedia)" />
        <AppText size="small" :text="$t(SETTINGS_PAGE_I18N.storageClearMediaDescription)" />
      </div>
      <Button
        :label="$t(SETTINGS_PAGE_I18N.storageClear)"
        :loading="isClearingMedia"
        size="small"
        severity="danger"
        type="button"
        @click="$emit('clearMedia')"
      />
    </div>
  </SettingsCard>
</template>

<style lang="scss">
.settings-storage-clear-card__row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.settings-storage-clear-card__info {
  display: grid;
  flex: 1;
  gap: 2px;
}

@include screen-mobile {
  .settings-storage-clear-card__row {
    flex-wrap: wrap;
  }

  .settings-storage-clear-card__row .p-button {
    flex: 1 1 100%;
  }
}
</style>
