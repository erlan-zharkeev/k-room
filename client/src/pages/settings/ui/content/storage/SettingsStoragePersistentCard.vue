<script setup lang="ts">
import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_STORAGE_I18N } from '../../../config/i18n/storage'
import { useSettingsStoragePersistentCard } from '../../../model/storage/use-settings-storage-persistent-card'
import SettingsCard from '../../SettingsCard.vue'

const { isPersistenceSupported, isPersistent, requestPersistence } = useSettingsStoragePersistentCard()
</script>

<template>
  <SettingsCard
    v-if="isPersistenceSupported"
    :title="$t(SETTINGS_PAGE_STORAGE_I18N.storagePersistent)"
    :button-label="isPersistent ? undefined : $t(SETTINGS_PAGE_STORAGE_I18N.storagePersistentRequest)"
    :on-button-click="isPersistent ? undefined : requestPersistence"
  >
    <AppText :text="$t(SETTINGS_PAGE_STORAGE_I18N.storagePersistentDescription)" />
    <AppText v-if="isPersistent" color="accent-color" :text="$t(SETTINGS_PAGE_STORAGE_I18N.storagePersistentGranted)" />
  </SettingsCard>
</template>
