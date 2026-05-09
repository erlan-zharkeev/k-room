<script setup lang="ts">
import { NmorphButton, NmorphForm, NmorphFormItem, NmorphTextInput } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { AppHeader, AppText } from 'src/shared/ui'

import { CREATE_NEW_PASSWORD_I18N } from '../config/i18n'
import { useCreateNewPassword } from '../model/use-create-new-password.model'

const {
  formData,
  formRef,
  initializeCreateNewPassword,
  isFormValid,
  isLoading,
  isPasswordChanged,
  passwordMismatch,
  passwordMismatchText,
  submit
} = useCreateNewPassword()
const isSubmitDisabled = computed(() => isLoading.value || passwordMismatch.value || !isFormValid.value)

onMounted(initializeCreateNewPassword)
</script>

<template>
  <div class="create-new-password-page">
    <AppHeader :text="$t(CREATE_NEW_PASSWORD_I18N.title)" />

    <template v-if="isPasswordChanged">
      <AppText tag="p" :text="$t(CREATE_NEW_PASSWORD_I18N.success)" />
      <div class="create-new-password-page__action-btns">
        <RouterLink custom :to="ROUTE_NAMES.authLogin" v-slot="{ navigate }">
          <NmorphButton :text="$t(CREATE_NEW_PASSWORD_I18N.toLogin)" @click="navigate" />
        </RouterLink>
      </div>
    </template>

    <template v-else>
      <AppText tag="p" :text="$t(CREATE_NEW_PASSWORD_I18N.enterNewPasswordHint)" />
      <AppText tag="p" :text="$t(CREATE_NEW_PASSWORD_I18N.repeatPasswordHint)" />

      <NmorphForm ref="formRef" :value="formData" class="create-new-password-page__form" @submit.prevent="submit">
        <NmorphFormItem id="firstPassword" class="create-new-password-page__field" :show-validation-icon="false">
          <NmorphTextInput
            v-model="formData.firstPassword.value"
            autocomplete="new-password"
            :disabled="isLoading"
            :placeholder="$t(CREATE_NEW_PASSWORD_I18N.firstPasswordPlaceholder)"
            type-password
          />
        </NmorphFormItem>

        <NmorphFormItem id="secondPassword" class="create-new-password-page__field" :show-validation-icon="false">
          <NmorphTextInput
            v-model="formData.secondPassword.value"
            autocomplete="new-password"
            :disabled="isLoading"
            :placeholder="$t(CREATE_NEW_PASSWORD_I18N.secondPasswordPlaceholder)"
            type-password
          />
          <AppText v-if="passwordMismatchText" tag="small" color="error-text" :text="passwordMismatchText" />
        </NmorphFormItem>

        <div class="create-new-password-page__action-btns">
          <NmorphButton
            :disabled="isSubmitDisabled"
            :loading="isLoading"
            :text="$t(CREATE_NEW_PASSWORD_I18N.changePassword)"
            type="submit"
          />

          <RouterLink custom :to="ROUTE_NAMES.authLogin" v-slot="{ navigate }">
            <NmorphButton :text="$t(CREATE_NEW_PASSWORD_I18N.back)" style-type="transparent" @click="navigate" />
          </RouterLink>
        </div>
      </NmorphForm>
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
