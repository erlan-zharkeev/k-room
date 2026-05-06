<script setup lang="ts">
import { NmorphButton, NmorphForm, NmorphFormItem, NmorphOTPInput, NmorphTextInput } from '@nmorph/nmorph-ui-kit'
import { EMAIL_CODE_LENGTH } from 'global-shared'

import { AppText } from 'src/shared/ui'

import { SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N } from '../../../config/i18n/account-change-email-card'
import { useSettingsChangeEmailCard } from '../../../model/account/use-settings-change-email-card'
import SettingsCard from '../../SettingsCard.vue'

const {
  currentEmail,
  emailNotChanged,
  formData,
  formRef,
  isEmailCodeVisible,
  isEmailCodeSending,
  isEmailCodeValidating,
  isSendCodeDisabled,
  isValidateCodeDisabled,
  otpCode,
  sendEmailCode,
  validateEmailCode
} = useSettingsChangeEmailCard()
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.changeEmail)">
    <NmorphForm ref="formRef" :value="formData" @submit.prevent="sendEmailCode">
      <NmorphFormItem
        id="currentEmail"
        :label="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.currentEmail)"
        :show-validation-icon="false"
      >
        <AppText color="contrast-text" truncate :text="currentEmail" />
      </NmorphFormItem>

      <NmorphFormItem
        id="nextEmail"
        :label="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.newEmail)"
        :show-validation-icon="false"
      >
        <NmorphTextInput
          v-model="formData.nextEmail.value"
          autocomplete="email"
          :disabled="isEmailCodeSending || isEmailCodeValidating"
          :input-attrs="{ type: 'email' }"
        />
        <AppText
          v-if="emailNotChanged"
          tag="small"
          color="warn"
          :text="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.emailNotChanged)"
        />
      </NmorphFormItem>

      <NmorphButton
        fill
        class="settings-change-email-card__button"
        :disabled="isSendCodeDisabled"
        :loading="isEmailCodeSending"
        :text="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.sendCode)"
        type="submit"
      />
    </NmorphForm>

    <label v-if="isEmailCodeVisible" class="settings-change-email-card__field">
      <AppText tag="small" :text="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.emailCode)" />
      <NmorphOTPInput
        v-model="otpCode"
        :length="EMAIL_CODE_LENGTH"
        :disabled="isEmailCodeSending || isEmailCodeValidating"
      />
      <NmorphButton
        class="settings-change-email-card__button"
        :disabled="isValidateCodeDisabled"
        :loading="isEmailCodeValidating"
        :text="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.validateCode)"
        @click="validateEmailCode"
      />
    </label>
  </SettingsCard>
</template>

<style lang="scss">
.settings-change-email-card__field {
  display: grid;
  gap: 8px;
}
</style>
