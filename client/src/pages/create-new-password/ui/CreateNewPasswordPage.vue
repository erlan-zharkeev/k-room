<script setup lang="ts">
import { Form } from '@primevue/forms'
import { ROUTE_NAMES } from 'global-shared'
import { Button, Message, Password } from 'primevue'
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { isFormFieldInvalid, useI18n } from 'src/shared/lib'
import { AppText } from 'src/shared/ui'

import { CREATE_NEW_PASSWORD_I18N } from '../config/i18n'
import { useCreateNewPassword } from '../model/use-create-new-password'

const { formData, initializeCreateNewPassword, isFormTouched, isLoading, isPasswordChanged, resolver, submit } =
  useCreateNewPassword()
const { t } = useI18n()
const passwordMismatchText = computed(() =>
  isFormTouched.value && formData.firstPassword !== formData.secondPassword ? t(CREATE_NEW_PASSWORD_I18N.mismatch) : ''
)
const isSubmitDisabled = computed(() => isLoading.value || formData.firstPassword !== formData.secondPassword)

onMounted(initializeCreateNewPassword)
</script>

<template>
  <div class="create-new-password-page">
    <template v-if="isPasswordChanged">
      <AppText tag="p" :text="$t(CREATE_NEW_PASSWORD_I18N.success)" />
      <div class="create-new-password-page__action-btns">
        <RouterLink custom :to="ROUTE_NAMES.authLogin" v-slot="{ href, navigate }">
          <Button as="a" :href="href" :label="$t(CREATE_NEW_PASSWORD_I18N.toLogin)" size="small" @click="navigate" />
        </RouterLink>
      </div>
    </template>

    <template v-else>
      <AppText tag="p" :text="$t(CREATE_NEW_PASSWORD_I18N.enterNewPasswordHint)" />
      <AppText tag="p" :text="$t(CREATE_NEW_PASSWORD_I18N.repeatPasswordHint)" />

      <Form
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
            fluid
            name="firstPassword"
            :placeholder="$t(CREATE_NEW_PASSWORD_I18N.firstPasswordPlaceholder)"
            size="small"
            toggle-mask
          />
          <Message v-if="isFormFieldInvalid($form.firstPassword)" severity="error" size="small" variant="simple">
            {{ $form.firstPassword.error?.message }}
          </Message>
        </div>

        <div class="create-new-password-page__field">
          <Password
            v-model="formData.secondPassword"
            autocomplete="new-password"
            :disabled="isLoading"
            :feedback="false"
            fluid
            name="secondPassword"
            :placeholder="$t(CREATE_NEW_PASSWORD_I18N.secondPasswordPlaceholder)"
            size="small"
            toggle-mask
          />
          <Message
            v-if="isFormFieldInvalid($form.secondPassword) || passwordMismatchText"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.secondPassword?.error?.message || passwordMismatchText }}
          </Message>
        </div>

        <div class="create-new-password-page__action-btns">
          <Button
            :disabled="isSubmitDisabled || !$form.valid"
            :label="$t(CREATE_NEW_PASSWORD_I18N.changePassword)"
            :loading="isLoading"
            size="small"
            type="submit"
          />

          <RouterLink custom :to="ROUTE_NAMES.authLogin" v-slot="{ href, navigate }">
            <Button
              as="a"
              :href="href"
              :label="$t(CREATE_NEW_PASSWORD_I18N.back)"
              severity="secondary"
              size="small"
              @click="navigate"
            />
          </RouterLink>
        </div>
      </Form>
    </template>
  </div>
</template>

<style>
.create-new-password-page,
.create-new-password-page__form {
  display: grid;
  gap: 12px;
}

.create-new-password-page__field {
  display: grid;
  gap: 4px;
}

.create-new-password-page__action-btns {
  display: flex;
  gap: 8px;
}
</style>
