<script setup lang="ts">
import { Form } from '@primevue/forms'
import { ROUTE_NAMES } from 'global-shared'
import { Button, Divider, InputText, Password } from 'primevue'
import { RouterLink } from 'vue-router'

import { AppIcon } from 'src/shared/ui'

import { LOGIN_FORM_I18N } from '../../config/i18n'
import type { ILoginFormProps } from '../../model/types'
import { useLoginForm } from '../../model/use-login-form'

const props = defineProps<ILoginFormProps>()
const { formData, getFirstErrorText, isFormDisabled, isSubmitDisabled, resolver, submit, touchField, visibleErrors } =
  useLoginForm(props)
</script>

<template>
  <Form v-slot="$form" :initial-values="formData" :resolver="resolver" class="login-form" @submit="submit">
    <div class="login-form__field">
      <InputText
        v-model="formData.email"
        autocomplete="email"
        :disabled="isFormDisabled"
        :invalid="Boolean($form.email?.invalid || visibleErrors.email?.length)"
        name="email"
        :placeholder="$t(LOGIN_FORM_I18N.emailPlaceholder)"
        type="email"
        @blur="touchField('email')"
        @update:model-value="touchField('email')"
      />
      <small class="login-form__error">
        {{ $form.email?.error?.message || getFirstErrorText('email') }}
      </small>
    </div>

    <div class="login-form__field">
      <Password
        v-model="formData.password"
        :disabled="isFormDisabled"
        :feedback="false"
        :invalid="Boolean($form.password?.invalid || visibleErrors.password?.length)"
        autocomplete="current-password"
        name="password"
        :placeholder="$t(LOGIN_FORM_I18N.passwordPlaceholder)"
        toggle-mask
        @blur="touchField('password')"
        @update:model-value="touchField('password')"
      />
      <small class="login-form__error">
        {{ $form.password?.error?.message || getFirstErrorText('password') }}
      </small>
    </div>

    <Button
      class="login-form__submit"
      :disabled="isSubmitDisabled"
      :label="$t(LOGIN_FORM_I18N.submit)"
      :loading="props.isLoading"
      type="submit"
    />

    <Button
      :disabled="props.isLoading"
      :label="$t(LOGIN_FORM_I18N.withGoogle)"
      :loading="props.isFirebaseLoginLoading"
      outlined
      type="button"
      @click="props.onFirebaseLogin('google')"
    >
      <template #icon>
        <AppIcon name="google" />
      </template>
    </Button>

    <div class="login-form__forgot">
      <RouterLink :to="ROUTE_NAMES.passwordRecovery">{{ $t(LOGIN_FORM_I18N.forgotPassword) }}</RouterLink>
    </div>

    <Divider />
  </Form>
</template>

<style scoped>
.login-form {
  display: grid;
  gap: 12px;
}

.login-form__field {
  display: grid;
  gap: 4px;
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

.login-form__error {
  min-height: 16px;
  font-size: 0.78rem;
  line-height: 1.2;
  color: var(--p-app-error);
}

.login-form__forgot {
  display: flex;
  justify-content: flex-end;
  min-height: 24px;
}

.login-form__forgot a {
  font-size: 0.9rem;
  color: var(--p-primary-color);
  text-decoration: none;
}

.login-form__forgot a:hover {
  text-decoration: underline;
}
</style>
