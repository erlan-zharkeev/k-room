<script setup lang="ts">
import { Form } from '@primevue/forms'
import { ROUTE_NAMES, SECURITY_ACTION } from 'global-shared'
import { Button, InputText, Message } from 'primevue'
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { COMMON_I18N } from 'src/shared/config'
import { isFormFieldInvalid } from 'src/shared/lib'
import { AppCaptcha, AppText } from 'src/shared/ui'

import { PASSWORD_RECOVERY_I18N } from '../config/i18n'
import { usePasswordRecovery } from '../model/use-password-recovery'

const {
  codeFormData,
  codeResolver,
  codeSent,
  codeValidationIsLoading,
  counterValue,
  debugCode,
  emailFormData,
  emailResolver,
  emailSendCodeIsLoading,
  initializePasswordRecovery,
  sendCaptcha,
  sendEmailCode,
  validateCaptcha,
  validateCode
} = usePasswordRecovery()
const route = useRoute()
const hasPresetEmail = computed(() => Boolean(route.query['user-email']))
const sendCaptchaRequired = sendCaptcha.captchaRequired
const sendCaptchaToken = sendCaptcha.captchaToken
const sendCaptchaResetKey = sendCaptcha.captchaResetKey
const validateCaptchaRequired = validateCaptcha.captchaRequired
const validateCaptchaToken = validateCaptcha.captchaToken
const validateCaptchaResetKey = validateCaptcha.captchaResetKey
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
    <AppText v-if="!codeSent" tag="p" :text="$t(PASSWORD_RECOVERY_I18N.enterEmailHint)" />
    <template v-else>
      <AppText tag="p" :text="$t(PASSWORD_RECOVERY_I18N.sentToEmail)" />
      <AppText bold color="accent-color" :text="emailFormData.email" />
      <AppText tag="p" :text="$t(PASSWORD_RECOVERY_I18N.enterCodeHint)" />
    </template>

    <Form
      v-slot="emailForm"
      :initial-values="emailFormData"
      :resolver="emailResolver"
      class="password-recovery-page__form"
      @submit="sendEmailCode"
    >
      <div class="password-recovery-page__field">
        <InputText
          v-model.trim="emailFormData.email"
          autocomplete="email"
          :disabled="isEmailInputDisabled"
          fluid
          name="email"
          :placeholder="$t(PASSWORD_RECOVERY_I18N.emailPlaceholder)"
          size="small"
          type="email"
        />
        <Message v-if="isFormFieldInvalid(emailForm.email)" severity="error" size="small" variant="simple">
          {{ emailForm.email.error?.message }}
        </Message>
      </div>

      <div class="password-recovery-page__action-btns">
        <Button
          :disabled="isSendCodeBlocked || !emailForm.valid"
          :label="codeSent ? $t(PASSWORD_RECOVERY_I18N.resend) : $t(COMMON_I18N.sendCode)"
          :loading="emailSendCodeIsLoading"
          size="small"
          type="submit"
        />
      </div>
    </Form>

    <AppCaptcha
      v-if="sendCaptchaRequired"
      :action="SECURITY_ACTION.sendPasswordRecoveryCode"
      v-model="sendCaptchaToken"
      :reset-key="sendCaptchaResetKey"
    />

    <AppText v-if="counterValue > 0" tag="p" :text="$t(PASSWORD_RECOVERY_I18N.resendTimer)(counterValue)" />

    <AppText v-if="debugCode" tag="p" :text="`${$t(PASSWORD_RECOVERY_I18N.debugCode)}: ${debugCode}`" />

    <Form
      v-if="codeSent"
      v-slot="codeForm"
      :initial-values="codeFormData"
      :resolver="codeResolver"
      class="password-recovery-page__form"
      @submit="validateCode"
    >
      <div class="password-recovery-page__field">
        <InputText
          v-model.trim="codeFormData.code"
          autocomplete="one-time-code"
          :disabled="codeValidationIsLoading"
          fluid
          name="code"
          :placeholder="$t(PASSWORD_RECOVERY_I18N.codePlaceholder)"
          size="small"
        />
        <Message v-if="isFormFieldInvalid(codeForm.code)" severity="error" size="small" variant="simple">
          {{ codeForm.code.error?.message }}
        </Message>
      </div>

      <div class="password-recovery-page__action-btns">
        <Button
          :disabled="isValidateCodeBlocked || !codeForm.valid"
          :label="$t(PASSWORD_RECOVERY_I18N.validate)"
          :loading="codeValidationIsLoading"
          size="small"
          type="submit"
        />
      </div>
    </Form>

    <AppCaptcha
      v-if="validateCaptchaRequired"
      :action="SECURITY_ACTION.validatePasswordRecoveryCode"
      v-model="validateCaptchaToken"
      :reset-key="validateCaptchaResetKey"
    />

    <div class="password-recovery-page__action-btns">
      <RouterLink custom :to="ROUTE_NAMES.authLogin" v-slot="{ href, navigate }">
        <Button
          as="a"
          :href="href"
          :label="$t(COMMON_I18N.back)"
          severity="secondary"
          size="small"
          @click="navigate"
        />
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
