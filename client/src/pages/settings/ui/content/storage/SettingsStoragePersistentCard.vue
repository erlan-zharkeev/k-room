<script setup lang="ts">
import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_STORAGE_I18N } from '../../../config/i18n/storage.i18n'
import { useStoragePersistent } from '../../../model/storage/use-storage-persistent'
import SettingsCard from '../../SettingsCard.vue'

const { isPersistenceSupported, isPersistent, requestPersistence } = useStoragePersistent()
</script>

<template>
  <SettingsCard
    v-if="isPersistenceSupported"
    :title="$t(SETTINGS_PAGE_STORAGE_I18N.storagePersistent)"
    :button-label="isPersistent ? undefined : $t(SETTINGS_PAGE_STORAGE_I18N.storagePersistentRequest)"
    :on-button-click="isPersistent ? undefined : requestPersistence"
  >
    <AppText :text="$t(SETTINGS_PAGE_STORAGE_I18N.storagePersistentDescription)" />
    <AppText v-if="isPersistent" color="accent" :text="$t(SETTINGS_PAGE_STORAGE_I18N.storagePersistentGranted)" />
  </SettingsCard>
</template>
