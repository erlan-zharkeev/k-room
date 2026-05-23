<script setup lang="ts">
import { NmorphButton, NmorphForm, NmorphFormItem, NmorphTextInput } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES, SECURITY_ACTION } from 'global-shared'
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { AppCaptcha, AppHeader, AppText } from 'src/shared/ui'

import { PASSWORD_RECOVERY_I18N } from '../config/i18n'
import { usePasswordRecovery } from '../model/use-password-recovery.model'

const {
  codeFormData,
  codeFormRef,
  codeSent,
  codeValidationIsLoading,
  counterValue,
  debugCode,
  emailFormData,
  emailFormRef,
  emailSendCodeIsLoading,
  initializePasswordRecovery,
  isCodeFormValid,
  isEmailFormValid,
  sendCaptcha,
  sendEmailCode,
  validateCaptcha,
  validateCode
} = usePasswordRecovery()
const route = useRoute()
const hasPresetEmail = computed(() => Boolean(route.query['user-email']))
const {
  captchaRequired: sendCaptchaRequired,
  captchaToken: sendCaptchaToken,
  captchaResetKey: sendCaptchaResetKey
} = sendCaptcha
const {
  captchaRequired: validateCaptchaRequired,
  captchaToken: validateCaptchaToken,
  captchaResetKey: validateCaptchaResetKey
} = validateCaptcha
const isEmailInputDisabled = computed(() => emailSendCodeIsLoading.value || hasPresetEmail.value)
const isSendCodeCaptchaBlocked = computed(() => sendCaptchaRequired.value && !sendCaptchaToken.value)
const isValidateCodeCaptchaBlocked = computed(() => validateCaptchaRequired.value && !validateCaptchaToken.value)
const isSendCodeBlocked = computed(
  () => emailSendCodeIsLoading.value || counterValue.value > 0 || isSendCodeCaptchaBlocked.value
)
const isValidateCodeBlocked = computed(() => codeValidationIsLoading.value || isValidateCodeCaptchaBlocked.value)

onMounted(initializePasswordRecovery)
</script>

<template>
  <div class="password-recovery-page">
    <AppHeader :text="$t(PASSWORD_RECOVERY_I18N.title)" />

    <AppText v-if="!codeSent" tag="p" :text="$t(PASSWORD_RECOVERY_I18N.enterEmailHint)" />
    <template v-else>
      <AppText tag="p" :text="$t(PASSWORD_RECOVERY_I18N.sentToEmail)" />
      <AppText bold color="accent" :text="emailFormData.email.value" />
      <AppText tag="p" :text="$t(PASSWORD_RECOVERY_I18N.enterCodeHint)" />
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
          :loading="emailSendCodeIsLoading"
          :text="codeSent ? $t(PASSWORD_RECOVERY_I18N.resend) : $t(PASSWORD_RECOVERY_I18N.sendCode)"
          type="submit"
        />
      </div>
    </NmorphForm>

    <AppCaptcha
      v-if="sendCaptchaRequired"
      :action="SECURITY_ACTION.sendPasswordRecoveryCode"
      v-model="sendCaptchaToken"
      :reset-key="sendCaptchaResetKey"
    />

    <AppText v-if="counterValue > 0" tag="p" :text="$t(PASSWORD_RECOVERY_I18N.resendTimer)(counterValue)" />

    <AppText v-if="debugCode" tag="p" :text="`${$t(PASSWORD_RECOVERY_I18N.debugCode)}: ${debugCode}`" />

    <NmorphForm
      v-if="codeSent"
      ref="codeFormRef"
      :value="codeFormData"
      class="password-recovery-page__form"
      @submit.prevent="validateCode"
    >
      <NmorphFormItem id="code" :show-validation-icon="false">
        <NmorphTextInput
          autocomplete="one-time-code"
          :disabled="codeValidationIsLoading"
          :placeholder="$t(PASSWORD_RECOVERY_I18N.codePlaceholder)"
        />
      </NmorphFormItem>

      <div class="password-recovery-page__action-btns">
        <NmorphButton
          :disabled="isValidateCodeBlocked || !isCodeFormValid"
          :loading="codeValidationIsLoading"
          :text="$t(PASSWORD_RECOVERY_I18N.validate)"
          type="submit"
        />
      </div>
    </NmorphForm>

    <AppCaptcha
      v-if="validateCaptchaRequired"
      :action="SECURITY_ACTION.validatePasswordRecoveryCode"
      v-model="validateCaptchaToken"
      :reset-key="validateCaptchaResetKey"
    />

    <div class="password-recovery-page__action-btns">
      <RouterLink custom :to="ROUTE_NAMES.authLogin" v-slot="{ navigate }">
        <NmorphButton :text="$t(PASSWORD_RECOVERY_I18N.back)" style-type="transparent" @click="navigate" />
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
