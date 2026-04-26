<script setup lang="ts">
import { Form } from '@primevue/forms'
import { ROUTE_NAMES } from 'global-shared'
import { Button, Message, Password } from 'primevue'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { AppText } from 'src/shared/ui'

import { CREATE_NEW_PASSWORD_I18N } from '../config/i18n'
import { useCreateNewPassword } from '../model/use-create-new-password'

const {
  firstPasswordErrorText,
  formData,
  initializeCreateNewPassword,
  isFirstPasswordInvalid,
  isLoading,
  isPasswordChanged,
  isSecondPasswordInvalid,
  isSubmitDisabled,
  resolver,
  secondPasswordErrorText,
  submit,
  touchField
} = useCreateNewPassword()

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

      <Form :initial-values="formData" :resolver="resolver" class="create-new-password-page__form" @submit="submit">
        <div class="create-new-password-page__field">
          <Password
            v-model="formData.firstPassword"
            autocomplete="new-password"
            :disabled="isLoading"
            :feedback="false"
            fluid
            :invalid="isFirstPasswordInvalid"
            name="firstPassword"
            :placeholder="$t(CREATE_NEW_PASSWORD_I18N.firstPasswordPlaceholder)"
            size="small"
            toggle-mask
            @blur="touchField('firstPassword')"
            @update:model-value="touchField('firstPassword')"
          />
          <Message v-if="firstPasswordErrorText" severity="error" size="small" variant="simple">
            {{ firstPasswordErrorText }}
          </Message>
        </div>

        <div class="create-new-password-page__field">
          <Password
            v-model="formData.secondPassword"
            autocomplete="new-password"
            :disabled="isLoading"
            :feedback="false"
            fluid
            :invalid="isSecondPasswordInvalid"
            name="secondPassword"
            :placeholder="$t(CREATE_NEW_PASSWORD_I18N.secondPasswordPlaceholder)"
            size="small"
            toggle-mask
            @blur="touchField('secondPassword')"
            @update:model-value="touchField('secondPassword')"
          />
          <Message v-if="secondPasswordErrorText" severity="error" size="small" variant="simple">
            {{ secondPasswordErrorText }}
          </Message>
        </div>

        <div class="create-new-password-page__action-btns">
          <Button
            :disabled="isSubmitDisabled"
            :label="$t(CREATE_NEW_PASSWORD_I18N.submit)"
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
