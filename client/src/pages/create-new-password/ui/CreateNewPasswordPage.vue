<script setup lang="ts">
import { Form } from '@primevue/forms'
import { ROUTE_NAMES } from 'global-shared'
import { Button, Password } from 'primevue'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { PageLayout } from 'src/widgets/page-layout'

import { CREATE_NEW_PASSWORD_I18N } from '../config/i18n'
import { useCreateNewPassword } from '../model/use-create-new-password'

const {
  formData,
  getFirstErrorText,
  initializeCreateNewPassword,
  isLoading,
  isPasswordChanged,
  isSubmitDisabled,
  passwordMismatchText,
  resolver,
  submit,
  touchField,
  visibleErrors
} = useCreateNewPassword()

onMounted(initializeCreateNewPassword)
</script>

<template>
  <PageLayout
    :back-label="$t(CREATE_NEW_PASSWORD_I18N.toLogin)"
    :fallback-route="ROUTE_NAMES.login"
    :title="$t(CREATE_NEW_PASSWORD_I18N.title)"
  >
    <div v-if="isPasswordChanged" class="create-new-password-page__success">
      <p>{{ $t(CREATE_NEW_PASSWORD_I18N.success) }}</p>
      <RouterLink :to="ROUTE_NAMES.login">{{ $t(CREATE_NEW_PASSWORD_I18N.toLogin) }}</RouterLink>
    </div>

    <Form
      v-else
      v-slot="$form"
      :initial-values="formData"
      :resolver="resolver"
      class="create-new-password-page__form"
      @submit="submit"
    >
      <div class="create-new-password-page__field">
        <Password
          v-model="formData.firstPassword"
          autocomplete="new-password"
          :disabled="isLoading"
          :feedback="false"
          :invalid="Boolean($form.firstPassword?.invalid || visibleErrors.firstPassword?.length)"
          name="firstPassword"
          :placeholder="$t(CREATE_NEW_PASSWORD_I18N.firstPasswordPlaceholder)"
          toggle-mask
          @blur="touchField('firstPassword')"
          @update:model-value="touchField('firstPassword')"
        />
        <small>{{ $form.firstPassword?.error?.message || getFirstErrorText('firstPassword') }}</small>
      </div>

      <div class="create-new-password-page__field">
        <Password
          v-model="formData.secondPassword"
          autocomplete="new-password"
          :disabled="isLoading"
          :feedback="false"
          :invalid="
            Boolean($form.secondPassword?.invalid || visibleErrors.secondPassword?.length || passwordMismatchText)
          "
          name="secondPassword"
          :placeholder="$t(CREATE_NEW_PASSWORD_I18N.secondPasswordPlaceholder)"
          toggle-mask
          @blur="touchField('secondPassword')"
          @update:model-value="touchField('secondPassword')"
        />
        <small>
          {{ $form.secondPassword?.error?.message || getFirstErrorText('secondPassword') || passwordMismatchText }}
        </small>
      </div>

      <Button
        :disabled="isSubmitDisabled"
        :label="$t(CREATE_NEW_PASSWORD_I18N.submit)"
        :loading="isLoading"
        type="submit"
      />
    </Form>
  </PageLayout>
</template>

<style scoped>
.create-new-password-page__form,
.create-new-password-page__success {
  display: grid;
  gap: 12px;
}

.create-new-password-page__field {
  display: grid;
  gap: 4px;
}

.create-new-password-page__field :deep(.p-password),
.create-new-password-page__field :deep(.p-password-input),
.create-new-password-page__form :deep(.p-button) {
  width: 100%;
}

.create-new-password-page__field small {
  min-height: 16px;
  font-size: 0.78rem;
  color: var(--p-app-error);
}

.create-new-password-page__success p {
  margin: 0;
}

.create-new-password-page__success a {
  color: var(--p-primary-color);
  text-decoration: none;
}
</style>
