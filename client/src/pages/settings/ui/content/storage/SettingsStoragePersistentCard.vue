<script setup lang="ts">
import { NmorphText } from '@nmorph/nmorph-ui-kit'

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
    <NmorphText class="settings-storage-persistent-card__description" as="p">{{
      $t(SETTINGS_PAGE_STORAGE_I18N.storagePersistentDescription)
    }}</NmorphText>
    <NmorphText v-if="isPersistent" color="accent">{{
      $t(SETTINGS_PAGE_STORAGE_I18N.storagePersistentGranted)
    }}</NmorphText>
  </SettingsCard>
</template>

<style lang="scss">
.settings-storage-persistent-card__description {
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
}
</style>
