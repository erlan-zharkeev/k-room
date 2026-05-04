<script setup lang="ts">
import { NmorphForm, NmorphFormItem, NmorphTextInput } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { SETTINGS_ACCOUNT_CHANGE_PASSWORD_CARD_I18N } from '../../../config/i18n/account-change-password-card'
import { useSettingsChangePasswordCard } from '../../../model/account/use-settings-change-password-card'
import SettingsCard from '../../SettingsCard.vue'

const { changePassword, formData, isPasswordChanging, isPasswordSubmitDisabled, nextPasswordError, passwordMismatch } =
  useSettingsChangePasswordCard()
</script>

<template>
  <SettingsCard
    :button-aria-label="$t(SETTINGS_ACCOUNT_CHANGE_PASSWORD_CARD_I18N.changePassword)"
    :button-disabled="isPasswordSubmitDisabled"
    :button-label="$t(SETTINGS_ACCOUNT_CHANGE_PASSWORD_CARD_I18N.changePassword)"
    :button-loading="isPasswordChanging"
    :on-button-click="changePassword"
    :title="$t(SETTINGS_ACCOUNT_CHANGE_PASSWORD_CARD_I18N.changePassword)"
  >
    <NmorphForm :value="formData" @submit.prevent="changePassword">
      <NmorphFormItem
        id="currentPassword"
        :label="$t(SETTINGS_ACCOUNT_CHANGE_PASSWORD_CARD_I18N.currentPassword)"
        :show-validation-icon="false"
      >
        <NmorphTextInput v-model="formData.currentPassword.value" :disabled="isPasswordChanging" type-password />
      </NmorphFormItem>

      <NmorphFormItem
        id="nextPassword"
        :label="$t(SETTINGS_ACCOUNT_CHANGE_PASSWORD_CARD_I18N.newPassword)"
        :show-validation-icon="false"
      >
        <NmorphTextInput v-model="formData.nextPassword.value" :disabled="isPasswordChanging" type-password />
        <AppText v-if="nextPasswordError" tag="small" color="warn-color" :text="nextPasswordError" />
      </NmorphFormItem>

      <NmorphFormItem
        id="repeatPassword"
        :label="$t(SETTINGS_ACCOUNT_CHANGE_PASSWORD_CARD_I18N.confirmPassword)"
        :show-validation-icon="false"
      >
        <NmorphTextInput v-model="formData.repeatPassword.value" :disabled="isPasswordChanging" type-password />
      </NmorphFormItem>

      <AppText
        v-if="passwordMismatch"
        tag="small"
        color="warn-color"
        :text="$t(SETTINGS_ACCOUNT_CHANGE_PASSWORD_CARD_I18N.passwordMismatch)"
      />
    </NmorphForm>
  </SettingsCard>
</template>
