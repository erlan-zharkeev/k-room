<script setup lang="ts">
import { Message, Password } from 'primevue'

import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_I18N } from '../../../config/i18n'
import { useSettingsChangePasswordCard } from '../../../model/account/use-settings-change-password-card'
import SettingsCard from '../../SettingsCard.vue'

const {
  changePassword,
  currentPassword,
  isPasswordChanging,
  isPasswordSubmitDisabled,
  nextPassword,
  nextPasswordError,
  passwordMismatch,
  repeatPassword
} = useSettingsChangePasswordCard()
</script>

<template>
  <SettingsCard
    :button-aria-label="$t(SETTINGS_PAGE_I18N.changePassword)"
    :button-disabled="isPasswordSubmitDisabled"
    :button-label="$t(SETTINGS_PAGE_I18N.changePassword)"
    :button-loading="isPasswordChanging"
    :on-button-click="changePassword"
    :title="$t(SETTINGS_PAGE_I18N.changePassword)"
  >
    <label class="settings-change-password-card__field">
      <AppText tag="small" :text="$t(SETTINGS_PAGE_I18N.currentPassword)" />
      <Password
        v-model="currentPassword"
        :feedback="false"
        autocomplete="current-password"
        fluid
        size="small"
        toggle-mask
      />
    </label>

    <label class="settings-change-password-card__field">
      <AppText tag="small" :text="$t(SETTINGS_PAGE_I18N.newPassword)" />
      <Password v-model="nextPassword" autocomplete="new-password" fluid size="small" toggle-mask />
      <Message v-if="nextPasswordError" severity="error" size="small" variant="simple">
        {{ nextPasswordError }}
      </Message>
    </label>

    <label class="settings-change-password-card__field">
      <AppText tag="small" :text="$t(SETTINGS_PAGE_I18N.confirmPassword)" />
      <Password v-model="repeatPassword" :feedback="false" autocomplete="new-password" fluid size="small" toggle-mask />
    </label>

    <Message v-if="passwordMismatch" severity="error" size="small" variant="simple">
      {{ $t(SETTINGS_PAGE_I18N.passwordMismatch) }}
    </Message>
  </SettingsCard>
</template>

<style lang="scss">
.settings-change-password-card__field {
  display: grid;
  gap: 8px;
}
</style>
