<script setup lang="ts">
import { EMAIL_CODE_LENGTH } from 'global-shared'
import { Button, InputOtp, InputText, Message } from 'primevue'

import { useScreen } from 'src/shared/lib'
import { AppText } from 'src/shared/ui'

import { SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N } from '../../../config/i18n/account-change-email-card'
import { useSettingsChangeEmailCard } from '../../../model/account/use-settings-change-email-card'
import SettingsCard from '../../SettingsCard.vue'

const { isMobile } = useScreen()
const {
  currentEmail,
  emailNotChanged,
  isEmailCodeSending,
  isEmailCodeValidating,
  isSendCodeDisabled,
  isValidateCodeDisabled,
  nextEmail,
  otpCode,
  sendEmailCode,
  validateEmailCode
} = useSettingsChangeEmailCard()
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.changeEmail)">
    <div class="settings-change-email-card__field">
      <AppText tag="small" :text="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.currentEmail)" />
      <AppText color="contrast-color" truncate :text="currentEmail" />
    </div>

    <label class="settings-change-email-card__field">
      <AppText tag="small" :text="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.newEmail)" />
      <InputText v-model.trim="nextEmail" autocomplete="email" fluid size="small" type="email" />
      <Message v-if="emailNotChanged" severity="error" size="small" variant="simple">
        {{ $t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.emailNotChanged) }}
      </Message>
      <Button
        :aria-label="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.sendCode)"
        class="settings-change-email-card__button"
        :disabled="isSendCodeDisabled"
        :fluid="isMobile"
        :label="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.sendCode)"
        :loading="isEmailCodeSending"
        size="small"
        type="button"
        @click="sendEmailCode"
      />
    </label>

    <label class="settings-change-email-card__field">
      <AppText tag="small" :text="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.emailCode)" />
      <InputOtp v-model="otpCode" :length="EMAIL_CODE_LENGTH" integer-only size="small" />
      <Button
        :aria-label="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.validateCode)"
        class="settings-change-email-card__button"
        :disabled="isValidateCodeDisabled"
        :fluid="isMobile"
        :label="$t(SETTINGS_ACCOUNT_CHANGE_EMAIL_CARD_I18N.validateCode)"
        :loading="isEmailCodeValidating"
        size="small"
        type="button"
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

.settings-change-email-card__button {
  justify-self: start;
}
</style>
