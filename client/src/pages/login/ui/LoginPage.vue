<script setup lang="ts">
import { Form } from '@primevue/forms'
import { ROUTE_NAMES } from 'global-shared'
import { Button, InputText, Message, Password } from 'primevue'
import { RouterLink } from 'vue-router'

import { isFormFieldInvalid } from 'src/shared/lib'
import { AppText } from 'src/shared/ui'

import { LOGIN_FORM_I18N } from '../config/i18n'
import { useFirebase } from '../model/use-firebase'
import { useLogin } from '../model/use-login'

const { isFirebaseLoginLoading, onFirebaseLogin } = useFirebase()
const { formData, isLoading, resolver, submit } = useLogin()
</script>

<template>
  <Form v-slot="$form" :initial-values="formData" :resolver="resolver" class="login-page" @submit="submit">
    <div class="login-page__field">
      <InputText
        v-model="formData.login"
        autocomplete="username"
        :disabled="isLoading || isFirebaseLoginLoading"
        fluid
        name="login"
        :placeholder="$t(LOGIN_FORM_I18N.loginPlaceholder)"
        size="small"
        type="text"
      />
      <Message v-if="isFormFieldInvalid($form.login)" severity="error" size="small" variant="simple">
        {{ $form.login.error?.message }}
      </Message>
    </div>

    <div class="login-page__field">
      <Password
        v-model="formData.password"
        :disabled="isLoading || isFirebaseLoginLoading"
        :feedback="false"
        fluid
        autocomplete="current-password"
        name="password"
        :placeholder="$t(LOGIN_FORM_I18N.passwordPlaceholder)"
        size="small"
        toggle-mask
      />
      <Message v-if="isFormFieldInvalid($form.password)" severity="error" size="small" variant="simple">
        {{ $form.password.error?.message }}
      </Message>
    </div>

    <Button
      class="login-page__submit"
      :disabled="isLoading || isFirebaseLoginLoading || !$form.valid"
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
