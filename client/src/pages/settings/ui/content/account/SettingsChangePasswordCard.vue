<script setup lang="ts">
import { NmorphForm, NmorphFormItem, NmorphTextInput } from '@nmorph/nmorph-ui-kit'

import { SETTINGS_ACCOUNT_CHANGE_PASSWORD_I18N } from '../../../config/i18n/account-change-password.i18n'
import { useChangePassword } from '../../../model/account/use-change-password.model'
import SettingsCard from '../../SettingsCard.vue'

const { changePassword, formData, formResetKey, isPasswordChanging, isPasswordSubmitDisabled } = useChangePassword()
</script>

<template>
  <SettingsCard
    :button-aria-label="$t(SETTINGS_ACCOUNT_CHANGE_PASSWORD_I18N.changePassword)"
    :button-disabled="isPasswordSubmitDisabled"
    :button-label="$t(SETTINGS_ACCOUNT_CHANGE_PASSWORD_I18N.changePassword)"
    :button-loading="isPasswordChanging"
    :on-button-click="changePassword"
    :title="$t(SETTINGS_ACCOUNT_CHANGE_PASSWORD_I18N.changePassword)"
  >
    <NmorphForm :key="formResetKey" ref="formRef" :value="formData" @submit.prevent="changePassword">
      <NmorphFormItem
        id="currentPassword"
        :label="$t(SETTINGS_ACCOUNT_CHANGE_PASSWORD_I18N.currentPassword)"
        :show-validation-icon="false"
      >
        <NmorphTextInput :disabled="isPasswordChanging" type-password />
      </NmorphFormItem>

      <NmorphFormItem
        id="nextPassword"
        :label="$t(SETTINGS_ACCOUNT_CHANGE_PASSWORD_I18N.newPassword)"
        :show-validation-icon="false"
      >
        <NmorphTextInput :disabled="isPasswordChanging" type-password />
      </NmorphFormItem>

      <NmorphFormItem
        id="repeatPassword"
        :label="$t(SETTINGS_ACCOUNT_CHANGE_PASSWORD_I18N.confirmPassword)"
        :show-validation-icon="false"
      >
        <NmorphTextInput :disabled="isPasswordChanging" type-password />
      </NmorphFormItem>
    </NmorphForm>
  </SettingsCard>
</template>
