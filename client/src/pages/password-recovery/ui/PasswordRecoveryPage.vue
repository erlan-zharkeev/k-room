<script setup lang="ts">
import { Form } from '@primevue/forms'
import { ROUTE_NAMES } from 'global-shared'
import { Button, InputText, Message } from 'primevue'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { AppText } from 'src/shared/ui'

import { PASSWORD_RECOVERY_I18N } from '../config/i18n'
import { usePasswordRecovery } from '../model/use-password-recovery'

const {
  codeErrorText,
  codeFormData,
  codeResolver,
  codeSent,
  codeValidation,
  codeValidationIsLoading,
  counterValue,
  debugCode,
  emailErrorText,
  emailFormData,
  emailResolver,
  emailSendCodeIsLoading,
  emailValidation,
  isCodeInvalid,
  isEmailInputDisabled,
  isEmailInvalid,
  isSendCodeDisabled,
  isValidateCodeDisabled,
  initializePasswordRecovery,
  sendEmailCode,
  validateCode
} = usePasswordRecovery()

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
      :initial-values="emailFormData"
      :resolver="emailResolver"
      class="password-recovery-page__form"
      @submit="sendEmailCode"
    >
      <div class="password-recovery-page__field">
        <InputText
          v-model="emailFormData.email"
          autocomplete="email"
          :disabled="isEmailInputDisabled"
          fluid
          :invalid="isEmailInvalid"
          name="email"
          :placeholder="$t(PASSWORD_RECOVERY_I18N.emailPlaceholder)"
          size="small"
          type="email"
          @blur="emailValidation.touchField('email')"
          @update:model-value="emailValidation.touchField('email')"
        />
        <Message v-if="emailErrorText" severity="error" size="small" variant="simple">
          {{ emailErrorText }}
        </Message>
      </div>

      <div class="password-recovery-page__action-btns">
        <Button
          :disabled="isSendCodeDisabled"
          :label="codeSent ? $t(PASSWORD_RECOVERY_I18N.resend) : $t(PASSWORD_RECOVERY_I18N.sendCode)"
          :loading="emailSendCodeIsLoading"
          size="small"
          type="submit"
        />
      </div>
    </Form>

    <AppText v-if="counterValue > 0" tag="p" :text="$t(PASSWORD_RECOVERY_I18N.resendTimer)(counterValue)" />

    <AppText v-if="debugCode" tag="p" :text="`${$t(PASSWORD_RECOVERY_I18N.debugCode)}: ${debugCode}`" />

    <Form
      v-if="codeSent"
      :initial-values="codeFormData"
      :resolver="codeResolver"
      class="password-recovery-page__form"
      @submit="validateCode"
    >
      <div class="password-recovery-page__field">
        <InputText
          v-model="codeFormData.code"
          autocomplete="one-time-code"
          :disabled="codeValidationIsLoading"
          fluid
          :invalid="isCodeInvalid"
          name="code"
          :placeholder="$t(PASSWORD_RECOVERY_I18N.codePlaceholder)"
          size="small"
          @blur="codeValidation.touchField('code')"
          @update:model-value="codeValidation.touchField('code')"
        />
        <Message v-if="codeErrorText" severity="error" size="small" variant="simple">
          {{ codeErrorText }}
        </Message>
      </div>

      <div class="password-recovery-page__action-btns">
        <Button
          :disabled="isValidateCodeDisabled"
          :label="$t(PASSWORD_RECOVERY_I18N.validate)"
          :loading="codeValidationIsLoading"
          size="small"
          type="submit"
        />
      </div>
    </Form>

    <div class="password-recovery-page__action-btns">
      <RouterLink custom :to="ROUTE_NAMES.authLogin" v-slot="{ href, navigate }">
        <Button
          as="a"
          :href="href"
          :label="$t(PASSWORD_RECOVERY_I18N.back)"
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
