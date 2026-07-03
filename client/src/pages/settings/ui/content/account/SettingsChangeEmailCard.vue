<script setup lang="ts">
import {
  NmorphText,
  NmorphButton,
  NmorphForm,
  NmorphFormItem,
  NmorphOTPInput,
  NmorphTextInput
} from '@nmorph/nmorph-ui-kit'
import { EMAIL_CODE_LENGTH } from 'global-shared'

import { SETTINGS_ACCOUNT_CHANGE_EMAIL_I18N } from '../../../config/i18n/account-change-email.i18n'
import { useChangeEmail } from '../../../model/account/use-change-email.model'
import SettingsCard from '../../SettingsCard.vue'

const {
  currentEmail,
  formData,
  formResetKey,
  isEmailCodeVisible,
  isEmailCodeSending,
  isEmailCodeValidating,
  isSendCodeDisabled,
  isValidateCodeDisabled,
  otpCode,
  sendEmailCode,
  validateEmailCode
} = useChangeEmail()
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_I18N.changeEmail)">
    <NmorphForm :key="formResetKey" ref="formRef" :value="formData" @submit.prevent="sendEmailCode">
      <NmorphFormItem
        id="currentEmail"
        :label="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_I18N.currentEmail)"
        :show-validation-icon="false"
      >
        <NmorphText>{{ currentEmail }}</NmorphText>
      </NmorphFormItem>

      <NmorphFormItem
        id="nextEmail"
        :label="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_I18N.newEmail)"
        :show-validation-icon="false"
      >
        <NmorphTextInput
          autocomplete="email"
          :disabled="isEmailCodeSending || isEmailCodeValidating"
          :input-attrs="{ type: 'email' }"
        />
      </NmorphFormItem>

      <NmorphButton
        fill
        :disabled="isSendCodeDisabled"
        :loading="isEmailCodeSending"
        :text="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_I18N.sendCode)"
        type="submit"
      />
    </NmorphForm>

    <label v-if="isEmailCodeVisible" class="settings-change-email-card__field">
      <NmorphText as="small" variant="body-small">{{ $t(SETTINGS_ACCOUNT_CHANGE_EMAIL_I18N.emailCode) }}</NmorphText>
      <NmorphOTPInput
        v-model="otpCode"
        :length="EMAIL_CODE_LENGTH"
        :disabled="isEmailCodeSending || isEmailCodeValidating"
      />
      <NmorphButton
        :disabled="isValidateCodeDisabled"
        :loading="isEmailCodeValidating"
        :text="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_I18N.validateCode)"
        @click="validateEmailCode"
      />
    </label>
  </SettingsCard>
</template>

<style lang="scss" scoped>
.settings-change-email-card__field {
  display: grid;
  gap: 8px;
}
</style>
