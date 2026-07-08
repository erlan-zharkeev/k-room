<script setup lang="ts">
import {
  NmorphText,
  NmorphButton,
  NmorphForm,
  NmorphFormItem,
  NmorphIcon,
  NmorphIconGoogle,
  NmorphTextInput
} from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'
import { RouterLink } from 'vue-router'

import { AppCaptcha } from 'src/shared/ui'

import { LOGIN_FORM_I18N } from '../config/i18n'
import { useLogin } from '../model/use-login.model'

const {
  captchaRequired,
  captchaResetKey,
  captchaToken,
  formData,
  isFirebaseLoginDisabled,
  isFirebaseLoginLoading,
  isFormDisabled,
  isLoading,
  isSubmitBtnDisabled,
  onFirebaseLogin,
  submit
} = useLogin()
</script>

<template>
  <NmorphForm ref="formRef" :value="formData" class="login-page" @submit.prevent="submit">
    <NmorphFormItem id="login" :show-validation-icon="false">
      <NmorphTextInput
        autocomplete="username"
        :disabled="isFormDisabled"
        :placeholder="$t(LOGIN_FORM_I18N.loginPlaceholder)"
        clearable
      />
    </NmorphFormItem>

    <NmorphFormItem id="password" :show-validation-icon="false">
      <NmorphTextInput
        autocomplete="current-password"
        :disabled="isFormDisabled"
        :placeholder="$t(LOGIN_FORM_I18N.passwordPlaceholder)"
        type-password
      />
    </NmorphFormItem>

    <AppCaptcha v-if="captchaRequired" :action="'login'" v-model="captchaToken" :reset-key="captchaResetKey" />
    <div class="login-page__action-btns">
      <NmorphButton
        :disabled="isSubmitBtnDisabled"
        fill
        :loading="isLoading"
        :text="$t(LOGIN_FORM_I18N.submit)"
        type="submit"
      />

      <NmorphButton
        :disabled="isFirebaseLoginDisabled"
        fill
        :loading="isFirebaseLoginLoading"
        @click="onFirebaseLogin('google')"
      >
        <div class="login-page__button__google">
          <NmorphIcon>
            <NmorphIconGoogle />
          </NmorphIcon>
          <NmorphText>{{ $t(LOGIN_FORM_I18N.withGoogle) }}</NmorphText>
        </div>
      </NmorphButton>

      <div class="login-page__forgot">
        <RouterLink :to="ROUTE_NAMES.passwordRecovery">
          <NmorphText color="accent">{{ $t(LOGIN_FORM_I18N.forgotPassword) }}</NmorphText>
        </RouterLink>
      </div>
    </div>
  </NmorphForm>
</template>

<style scoped>
.login-page {
  display: grid;
  gap: 12px;
}

.login-page__action-btns {
  display: grid;
  gap: 12px;
}

.login-page__forgot {
  text-align: right;
}

.login-page__button__google {
  display: flex;
  gap: 3px;
  align-items: center;
}
</style>
