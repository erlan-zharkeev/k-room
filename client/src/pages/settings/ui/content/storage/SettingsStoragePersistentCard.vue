<script setup lang="ts">
import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_STORAGE_I18N } from '../../../config/i18n/storage.i18n'
import { useStoragePersistent } from '../../../model/storage/use-storage-persistent.model'
import SettingsCard from '../../SettingsCard.vue'

const { isPersistenceSupported, isPersistent, isPersistenceLoading, requestPersistence } = useStoragePersistent()
</script>

<template>
  <SettingsCard
    v-if="isPersistenceSupported"
    :title="$t(SETTINGS_PAGE_STORAGE_I18N.storagePersistent)"
    :button-label="isPersistent ? undefined : $t(SETTINGS_PAGE_STORAGE_I18N.storagePersistentRequest)"
    :button-loading="isPersistenceLoading"
    :on-button-click="isPersistent ? undefined : requestPersistence"
  >
    <AppText
      class="settings-storage-persistent-card__description"
      tag="p"
      :text="$t(SETTINGS_PAGE_STORAGE_I18N.storagePersistentDescription)"
    />
    <AppText v-if="isPersistent" color="accent" :text="$t(SETTINGS_PAGE_STORAGE_I18N.storagePersistentGranted)" />
  </SettingsCard>
</template>

<style lang="scss">
.settings-storage-persistent-card__description {
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
}
</style>
