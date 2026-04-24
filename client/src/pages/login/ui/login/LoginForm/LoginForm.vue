<script setup lang="ts">
import { ROUTE_NAMES } from 'global-shared'
import clone from 'lodash/clone'
import { Button, Divider, InputText, Password } from 'primevue'
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'

import { DEFAULT_LOGIN_FORM_DATA } from '../../../config/constants'
import { LOGIN_FORM_I18N } from '../../../config/i18n'
import { LOGIN_FORM_RULES } from '../../../config/rules'

import type { ILoginFormProps } from './types'

const props = defineProps<ILoginFormProps>()
const formData = reactive(clone(DEFAULT_LOGIN_FORM_DATA))
</script>

<template>
  <form class="login-form" @submit.prevent="props.onLogin(formData)">
    <InputText
      v-model="formData.email"
      v-bind="LOGIN_FORM_RULES.email"
      autocomplete="email"
      :placeholder="$t(LOGIN_FORM_I18N.emailPlaceholder)"
      type="email"
    />
    <Password
      v-model="formData.password"
      v-bind="LOGIN_FORM_RULES.password"
      :disabled="props.isFirebaseLoginLoading"
      :feedback="false"
      autocomplete="current-password"
      :placeholder="$t(LOGIN_FORM_I18N.passwordPlaceholder)"
      toggle-mask
    />

    <Button
      class="login-form__submit"
      :disabled="props.isFirebaseLoginLoading"
      :label="$t(LOGIN_FORM_I18N.submit)"
      :loading="props.isLoading"
      type="submit"
    />

    <Button
      icon="pi pi-google"
      :disabled="props.isLoading"
      :label="$t(LOGIN_FORM_I18N.withGoogle)"
      :loading="props.isFirebaseLoginLoading"
      outlined
      type="button"
      @click="props.onFirebaseLogin('google')"
    />

    <div class="login-form__forgot">
      <RouterLink :to="ROUTE_NAMES.passwordRecovery">{{ $t(LOGIN_FORM_I18N.forgotPassword) }}</RouterLink>
    </div>

    <Divider />
  </form>
</template>

<style scoped>
.login-form {
  display: grid;
  gap: 12px;
}

.login-form :deep(.p-inputtext),
.login-form :deep(.p-password),
.login-form :deep(.p-password-input),
.login-form :deep(.p-button) {
  width: 100%;
}

.login-form__submit {
  margin-top: 4px;
}

.login-form__forgot {
  display: flex;
  justify-content: flex-end;
  min-height: 24px;
}

.login-form__forgot a {
  font-size: 0.9rem;
  color: var(--accent);
  text-decoration: none;
}

.login-form__forgot a:hover {
  text-decoration: underline;
}
</style>
