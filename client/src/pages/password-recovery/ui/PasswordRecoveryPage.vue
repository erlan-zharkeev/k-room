<script setup lang="ts">
import { Form } from '@primevue/forms'
import { ROUTE_NAMES } from 'global-shared'
import { Button, Card, InputText } from 'primevue'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { CLIENT_ENV } from 'src/shared/config'

import { PASSWORD_RECOVERY_I18N } from '../config/i18n'
import { usePasswordRecovery } from '../model/use-password-recovery'

const {
  codeFormData,
  codeResolver,
  codeSent,
  codeValidation,
  codeValidationIsLoading,
  counterValue,
  debugCode,
  emailFormData,
  emailResolver,
  emailSendCodeIsLoading,
  emailValidation,
  hasPresetEmail,
  isSendCodeDisabled,
  isValidateCodeDisabled,
  initializePasswordRecovery,
  sendEmailCode,
  validateCode
} = usePasswordRecovery()

onMounted(initializePasswordRecovery)
</script>

<template>
  <main class="password-recovery-page">
    <RouterLink :to="ROUTE_NAMES.login" class="password-recovery-page__logo" :aria-label="CLIENT_ENV.appName">
      <img src="/img/Logo.svg" :alt="CLIENT_ENV.appName" />
    </RouterLink>

    <Card class="password-recovery-page__card">
      <template #title>{{ $t(PASSWORD_RECOVERY_I18N.title) }}</template>
      <template #content>
        <Form
          v-slot="$form"
          :initial-values="emailFormData"
          :resolver="emailResolver"
          class="password-recovery-page__form"
          @submit="sendEmailCode"
        >
          <div class="password-recovery-page__field">
            <InputText
              v-model="emailFormData.email"
              autocomplete="email"
              :disabled="emailSendCodeIsLoading || hasPresetEmail"
              :invalid="Boolean($form.email?.invalid || emailValidation.visibleErrors.value.email?.length)"
              name="email"
              :placeholder="$t(PASSWORD_RECOVERY_I18N.emailPlaceholder)"
              type="email"
              @blur="emailValidation.touchField('email')"
              @update:model-value="emailValidation.touchField('email')"
            />
            <small>{{ $form.email?.error?.message || emailValidation.getFirstErrorText('email') }}</small>
          </div>

          <Button
            :disabled="isSendCodeDisabled"
            :label="$t(PASSWORD_RECOVERY_I18N.sendCode)"
            :loading="emailSendCodeIsLoading"
            type="submit"
          />
        </Form>

        <p v-if="counterValue > 0" class="password-recovery-page__hint">
          {{ $t(PASSWORD_RECOVERY_I18N.resendTimer)(counterValue) }}
        </p>

        <p v-if="debugCode" class="password-recovery-page__hint">
          {{ $t(PASSWORD_RECOVERY_I18N.debugCode) }}: {{ debugCode }}
        </p>

        <Form
          v-if="codeSent"
          v-slot="$form"
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
              :invalid="Boolean($form.code?.invalid || codeValidation.visibleErrors.value.code?.length)"
              name="code"
              :placeholder="$t(PASSWORD_RECOVERY_I18N.codePlaceholder)"
              @blur="codeValidation.touchField('code')"
              @update:model-value="codeValidation.touchField('code')"
            />
            <small>{{ $form.code?.error?.message || codeValidation.getFirstErrorText('code') }}</small>
          </div>

          <Button
            :disabled="isValidateCodeDisabled"
            :label="$t(PASSWORD_RECOVERY_I18N.validate)"
            :loading="codeValidationIsLoading"
            type="submit"
          />
        </Form>

        <RouterLink class="password-recovery-page__back" :to="ROUTE_NAMES.login">
          {{ $t(PASSWORD_RECOVERY_I18N.back) }}
        </RouterLink>
      </template>
    </Card>
  </main>
</template>

<style scoped>
.password-recovery-page {
  position: relative;

  display: grid;
  place-items: center;

  min-height: 100dvh;
  padding: 16px;
}

.password-recovery-page__logo {
  position: fixed;
  top: 16px;
  left: 16px;

  display: grid;
  place-items: center;

  width: 44px;
  height: 44px;
  padding: 6px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 12px;

  background: var(--p-content-background);
  box-shadow: 8px 8px 18px var(--p-app-shadow-outset-start), -8px -8px 18px var(--p-app-shadow-outset-end);
}

.password-recovery-page__logo img {
  display: block;
  width: 100%;
  height: 100%;
}

.password-recovery-page__card {
  width: min(100%, 420px);
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  background: var(--p-content-background);
  box-shadow: 16px 16px 36px var(--p-app-shadow-outset-start), -16px -16px 36px var(--p-app-shadow-outset-end);
}

.password-recovery-page__form {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.password-recovery-page__field {
  display: grid;
  gap: 4px;
}

.password-recovery-page__field :deep(.p-inputtext),
.password-recovery-page__form :deep(.p-button) {
  width: 100%;
}

.password-recovery-page__field small {
  min-height: 16px;
  font-size: 0.78rem;
  color: var(--p-app-error);
}

.password-recovery-page__hint {
  margin: 12px 0 0;
  color: var(--p-app-text-muted);
}

.password-recovery-page__back {
  display: inline-block;
  margin-top: 14px;
  color: var(--p-primary-color);
  text-decoration: none;
}
</style>
