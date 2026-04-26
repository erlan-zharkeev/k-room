<script setup lang="ts">
import { Form } from '@primevue/forms'
import { ROUTE_NAMES } from 'global-shared'
import { Button, InputText, Message, Password } from 'primevue'
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'

import { AppText } from 'src/shared/ui'

import { LOGIN_FORM_I18N } from '../config/i18n'
import { useFirebase } from '../model/use-firebase'
import { useLogin } from '../model/use-login'
import { useLoginForm } from '../model/use-login-form'

const { isLoading, onLogin } = useLogin()
const { isFirebaseLoginLoading, onFirebaseLogin } = useFirebase()
const loginFormProps = reactive({ isFirebaseLoginLoading, isLoading, onFirebaseLogin, onLogin })
const {
  emailErrorText,
  formData,
  isEmailInvalid,
  isFormDisabled,
  isPasswordInvalid,
  isSubmitDisabled,
  passwordErrorText,
  resolver,
  submit,
  touchField
} = useLoginForm(loginFormProps)
</script>

<template>
  <Form :initial-values="formData" :resolver="resolver" class="login-page" @submit="submit">
    <div class="login-page__field">
      <InputText
        v-model="formData.email"
        autocomplete="email"
        :disabled="isFormDisabled"
        fluid
        :invalid="isEmailInvalid"
        name="email"
        :placeholder="$t(LOGIN_FORM_I18N.emailPlaceholder)"
        size="small"
        type="email"
        @blur="touchField('email')"
        @update:model-value="touchField('email')"
      />
      <Message v-if="emailErrorText" severity="error" size="small" variant="simple">
        {{ emailErrorText }}
      </Message>
    </div>

    <div class="login-page__field">
      <Password
        v-model="formData.password"
        :disabled="isFormDisabled"
        :feedback="false"
        fluid
        :invalid="isPasswordInvalid"
        autocomplete="current-password"
        name="password"
        :placeholder="$t(LOGIN_FORM_I18N.passwordPlaceholder)"
        size="small"
        toggle-mask
        @blur="touchField('password')"
        @update:model-value="touchField('password')"
      />
      <Message v-if="passwordErrorText" severity="error" size="small" variant="simple">
        {{ passwordErrorText }}
      </Message>
    </div>

    <Button
      class="login-page__submit"
      :disabled="isSubmitDisabled"
      fluid
      :label="$t(LOGIN_FORM_I18N.submit)"
      :loading="isLoading"
      size="small"
      type="submit"
    />

    <Button
      :disabled="isLoading"
      fluid
      :label="$t(LOGIN_FORM_I18N.withGoogle)"
      :loading="isFirebaseLoginLoading"
      outlined
      size="small"
      type="button"
      @click="onFirebaseLogin('google')"
      icon="pi pi-google"
    >
    </Button>
    <div class="login-page__forgot">
      <RouterLink :to="ROUTE_NAMES.passwordRecovery">
        <AppText :text="$t(LOGIN_FORM_I18N.forgotPassword)" color="accent-color" />
      </RouterLink>
    </div>
  </Form>
</template>

<style>
.login-page {
  display: grid;
  gap: 12px;
}

.login-page__forgot {
  text-align: right;
}
</style>
