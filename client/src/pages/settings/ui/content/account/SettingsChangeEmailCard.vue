<script setup lang="ts">
import { NmorphButton, NmorphTextInput } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N } from '../../../config/i18n/account-change-email-card'
import { useSettingsChangeEmailCard } from '../../../model/account/use-settings-change-email-card'
import SettingsCard from '../../SettingsCard.vue'

const {
  currentEmail,
  emailNotChanged,
  isEmailCodeSending,
  isEmailCodeValidating,
  isSendCodeDisabled,
  isValidateCodeDisabled,
  nextEmail,
  otpCode,
  setOtpCode,
  sendEmailCode,
  validateEmailCode
} = useSettingsChangeEmailCard()
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.changeEmail)">
    <div class="settings-change-email-card__field">
      <AppText tag="small" :text="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.currentEmail)" />
      <AppText color="contrast-text" truncate :text="currentEmail" />
    </div>

    <label class="settings-change-email-card__field">
      <AppText tag="small" :text="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.newEmail)" />
      <NmorphTextInput v-model="nextEmail" :disabled="isEmailCodeSending || isEmailCodeValidating" />
      <AppText
        v-if="emailNotChanged"
        tag="small"
        color="warn"
        :text="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.emailNotChanged)"
      />
      <NmorphButton
        class="settings-change-email-card__button"
        :disabled="isSendCodeDisabled"
        :loading="isEmailCodeSending"
        :text="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.sendCode)"
        @click="sendEmailCode"
      />
    </label>

    <label class="settings-change-email-card__field">
      <AppText tag="small" :text="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.emailCode)" />
      <NmorphTextInput
        :model-value="otpCode"
        :disabled="isEmailCodeSending || isEmailCodeValidating"
        @update:model-value="setOtpCode"
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
