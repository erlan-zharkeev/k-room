<script setup lang="ts">
import { NmorphButton } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_STORAGE_I18N } from '../../../config/i18n/storage.i18n'
import { useStorageClear } from '../../../model/storage/use-storage-clear'
import SettingsCard from '../../SettingsCard.vue'

const { isClearingMedia, clearMedia } = useStorageClear()
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_STORAGE_I18N.storageClearCache)">
    <div class="settings-storage-clear-card__row">
      <div class="settings-storage-clear-card__info">
        <AppText color="contrast-text" :text="$t(SETTINGS_PAGE_STORAGE_I18N.storageClearMedia)" />
        <AppText size="small" :text="$t(SETTINGS_PAGE_STORAGE_I18N.storageClearMediaDescription)" />
      </div>
      <NmorphButton
        :text="$t(SETTINGS_PAGE_STORAGE_I18N.storageClear)"
        :loading="isClearingMedia"
        @click="clearMedia"
      />
    </div>
  </SettingsCard>
</template>

<style lang="scss">
.settings-storage-clear-card__row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.settings-storage-clear-card__info {
  display: grid;
  flex: 1;
  gap: 2px;
}

@include screen-tablet {
  .settings-storage-clear-card__row {
    flex-wrap: wrap;
  }

  .settings-storage-clear-card__row .nmorph-button {
    flex: 1 1 100%;
  }
}
</style>
