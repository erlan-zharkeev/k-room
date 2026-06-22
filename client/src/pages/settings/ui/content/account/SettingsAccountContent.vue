<script setup lang="ts">
import { useAccountContent } from '../../../model/account/use-account-content.model'

import SettingsChangeEmailCard from './SettingsChangeEmailCard.vue'
import SettingsChangePasswordCard from './SettingsChangePasswordCard.vue'
import SettingsPersonalDataCard from './SettingsPersonalDataCard.vue'

const { canManageCredentials } = useAccountContent()
</script>

<template>
  <div class="settings-account-content settings-content-grid settings-content-grid--compact-cards">
    <SettingsPersonalDataCard />
    <SettingsChangeEmailCard v-if="canManageCredentials" />
    <SettingsChangePasswordCard v-if="canManageCredentials" />
  </div>
</template>
