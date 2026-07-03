<script setup lang="ts">
import { NmorphText, NmorphButton, NmorphForm, NmorphFormItem, NmorphTextInput } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { CREATE_NEW_PASSWORD_I18N } from '../config/i18n'
import { useCreateNewPassword } from '../model/use-create-new-password.model'

const {
  formData,
  initializeCreateNewPassword,
  isLoading,
  isPasswordChanged,
  isSubmitDisabled,
  submit,
  successMessage
} = useCreateNewPassword()

onMounted(initializeCreateNewPassword)
</script>

<template>
  <div class="create-new-password-page">
    <NmorphText as="h3" variant="title" weight="bold">{{ $t(CREATE_NEW_PASSWORD_I18N.title) }}</NmorphText>

    <template v-if="isPasswordChanged">
      <NmorphText v-if="successMessage" as="p">{{ successMessage }}</NmorphText>
      <div class="create-new-password-page__action-btns">
        <RouterLink custom :to="ROUTE_NAMES.authLogin" v-slot="{ navigate }">
          <NmorphButton :text="$t(CREATE_NEW_PASSWORD_I18N.toLogin)" @click="navigate" />
        </RouterLink>
      </div>
    </template>

    <template v-else>
      <NmorphText as="p">{{ $t(CREATE_NEW_PASSWORD_I18N.enterNewPasswordHint) }}</NmorphText>
      <NmorphText as="p">{{ $t(CREATE_NEW_PASSWORD_I18N.repeatPasswordHint) }}</NmorphText>

      <NmorphForm ref="formRef" :value="formData" class="create-new-password-page__form" @submit.prevent="submit">
        <!-- Fake username field for browser password manager autocomplete. -->
        <input autocomplete="username" hidden readonly />

        <NmorphFormItem id="firstPassword" class="create-new-password-page__field" :show-validation-icon="false">
          <NmorphTextInput
            autocomplete="new-password"
            :disabled="isLoading"
            :placeholder="$t(CREATE_NEW_PASSWORD_I18N.firstPasswordPlaceholder)"
            type-password
          />
        </NmorphFormItem>

        <NmorphFormItem id="secondPassword" class="create-new-password-page__field" :show-validation-icon="false">
          <NmorphTextInput
            autocomplete="new-password"
            :disabled="isLoading"
            :placeholder="$t(CREATE_NEW_PASSWORD_I18N.secondPasswordPlaceholder)"
            type-password
          />
        </NmorphFormItem>

        <div class="create-new-password-page__action-btns">
          <NmorphButton
            :disabled="isSubmitDisabled"
            :loading="isLoading"
            :text="$t(CREATE_NEW_PASSWORD_I18N.changePassword)"
            type="submit"
          />

          <RouterLink custom :to="ROUTE_NAMES.authLogin" v-slot="{ navigate }">
            <NmorphButton :text="$t(CREATE_NEW_PASSWORD_I18N.back)" design="plain" borderless @click="navigate" />
          </RouterLink>
        </div>
      </NmorphForm>
    </template>
  </div>
</template>

<style scoped>
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
