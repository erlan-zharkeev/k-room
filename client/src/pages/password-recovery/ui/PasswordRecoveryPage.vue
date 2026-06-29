<script setup lang="ts">
import {
  NmorphText,
  NmorphButton,
  NmorphForm,
  NmorphFormItem,
  NmorphOTPInput,
  NmorphTextInput
} from '@nmorph/nmorph-ui-kit'
import { EMAIL_CODE_LENGTH, ROUTE_NAMES } from 'global-shared'
import { RouterLink } from 'vue-router'

import { AppCaptcha } from 'src/shared/ui'

import { PASSWORD_RECOVERY_I18N } from '../config/i18n'
import { usePasswordRecovery } from '../model/use-password-recovery.model'

const {
  codeFormData,
  codeSent,
  codeSentMessage,
  counterValue,
  debugCode,
  emailFormData,
  isCodeFormValid,
  isEmailInputDisabled,
  isEmailFormValid,
  isSendCodeBlocked,
  isSendingEmailCode,
  isValidateCodeBlocked,
  isValidatingCode,
  sendCaptchaRequired,
  sendCaptchaResetKey,
  sendCaptchaToken,
  sendEmailCode,
  validateCaptchaRequired,
  validateCaptchaResetKey,
  validateCaptchaToken,
  validateCode
} = usePasswordRecovery()
</script>

<template>
  <div class="password-recovery-page">
    <NmorphText as="h3" variant="title" weight="bold">{{ $t(PASSWORD_RECOVERY_I18N.title) }}</NmorphText>

    <NmorphText v-if="!codeSent" as="p">{{ $t(PASSWORD_RECOVERY_I18N.enterEmailHint) }}</NmorphText>
    <template v-else>
      <NmorphText v-if="codeSentMessage" as="p">{{ codeSentMessage }}</NmorphText>
      <NmorphText color="accent" weight="bold">{{ emailFormData.email.value }}</NmorphText>
      <NmorphText as="p">{{ $t(PASSWORD_RECOVERY_I18N.enterCodeHint) }}</NmorphText>
    </template>

    <NmorphForm
      ref="emailFormRef"
      :value="emailFormData"
      class="password-recovery-page__form"
      @submit.prevent="sendEmailCode"
    >
      <NmorphFormItem id="email" :show-validation-icon="false">
        <NmorphTextInput
          autocomplete="email"
          :disabled="isEmailInputDisabled"
          :placeholder="$t(PASSWORD_RECOVERY_I18N.emailPlaceholder)"
          :input-attrs="{ type: 'email' }"
          clearable
        />
      </NmorphFormItem>

      <div class="password-recovery-page__action-btns">
        <NmorphButton
          :disabled="isSendCodeBlocked || !isEmailFormValid"
          :loading="isSendingEmailCode"
          :text="codeSent ? $t(PASSWORD_RECOVERY_I18N.resend) : $t(PASSWORD_RECOVERY_I18N.sendCode)"
          type="submit"
        />
      </div>
    </NmorphForm>

    <AppCaptcha
      v-if="sendCaptchaRequired"
      :action="'send-password-recovery-code'"
      v-model="sendCaptchaToken"
      :reset-key="sendCaptchaResetKey"
    />

    <NmorphText v-if="counterValue > 0" as="p">{{
      $t(PASSWORD_RECOVERY_I18N.resendTimer, { seconds: counterValue })
    }}</NmorphText>

    <NmorphText v-if="debugCode" as="p">{{ `${$t(PASSWORD_RECOVERY_I18N.debugCode)}: ${debugCode}` }}</NmorphText>

    <NmorphForm
      v-if="codeSent"
      ref="codeFormRef"
      :value="codeFormData"
      class="password-recovery-page__form"
      @submit.prevent="validateCode"
    >
      <NmorphFormItem id="code" :show-validation-icon="false">
        <NmorphOTPInput :length="EMAIL_CODE_LENGTH" :disabled="isValidatingCode" />
      </NmorphFormItem>

      <div class="password-recovery-page__action-btns">
        <NmorphButton
          :disabled="isValidateCodeBlocked || !isCodeFormValid"
          :loading="isValidatingCode"
          :text="$t(PASSWORD_RECOVERY_I18N.validate)"
          type="submit"
        />
      </div>
    </NmorphForm>

    <AppCaptcha
      v-if="validateCaptchaRequired"
      :action="'validate-password-recovery-code'"
      v-model="validateCaptchaToken"
      :reset-key="validateCaptchaResetKey"
    />

    <div class="password-recovery-page__action-btns">
      <RouterLink custom :to="ROUTE_NAMES.authLogin" v-slot="{ navigate }">
        <NmorphButton :text="$t(PASSWORD_RECOVERY_I18N.back)" design="plain" borderless @click="navigate" />
      </RouterLink>
    </div>
  </div>
</template>

<style>
.password-recovery-page {
  display: grid;
  gap: 12px;
}

.password-recovery-page__form {
  display: grid;
  gap: 12px;
}

.password-recovery-page__action-btns {
  display: flex;
  gap: 8px;
}
</style>
