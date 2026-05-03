<script setup lang="ts">
import {
  NmorphButton,
  NmorphForm,
  NmorphFormItem,
  NmorphIcon,
  NmorphIconGoogle,
  NmorphTextInput
} from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES, SECURITY_ACTION } from 'global-shared'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { AppCaptcha, AppText } from 'src/shared/ui'

import { LOGIN_FORM_I18N } from '../config/i18n'
import { useFirebase } from '../model/use-firebase'
import { useLogin } from '../model/use-login'

const { isFirebaseLoginLoading, onFirebaseLogin } = useFirebase()
const { captchaRequired, captchaResetKey, captchaToken, formData, formRef, isFormValid, isLoading, submit } = useLogin()
const isFormDisabled = computed(() => isLoading.value || isFirebaseLoginLoading.value)
const isCaptchaBlocked = computed(() => captchaRequired.value && !captchaToken.value)
const isSubmitDisabled = computed(() => isFormDisabled.value || isCaptchaBlocked.value)
</script>

<template>
  <NmorphForm ref="formRef" :value="formData" class="login-page" @submit.prevent="submit">
    <NmorphFormItem id="login" class="login-page__field" :show-validation-icon="false">
      <NmorphTextInput
        v-model="formData.login.value"
        class="login-page__input"
        :disabled="isFormDisabled"
        :placeholder="$t(LOGIN_FORM_I18N.loginPlaceholder)"
        clearable
        @on-enter="submit"
      />
    </NmorphFormItem>

    <NmorphFormItem id="password" class="login-page__field" :show-validation-icon="false">
      <NmorphTextInput
        v-model="formData.password.value"
        class="login-page__input"
        :disabled="isFormDisabled"
        :placeholder="$t(LOGIN_FORM_I18N.passwordPlaceholder)"
        type-password
        @on-enter="submit"
      />
    </NmorphFormItem>

    <AppCaptcha
      v-if="captchaRequired"
      :action="SECURITY_ACTION.login"
      v-model="captchaToken"
      :reset-key="captchaResetKey"
    />
    <div class="login-page__action-btns">
      <NmorphButton
        class="login-page__button"
        :disabled="isSubmitDisabled || !isFormValid"
        fill
        :loading="isLoading"
        :text="$t(LOGIN_FORM_I18N.submit)"
        type="submit"
      />

      <NmorphButton
        class="login-page__button"
        :disabled="isFormDisabled"
        fill
        :loading="isFirebaseLoginLoading"
        type="button"
        @click="onFirebaseLogin('google')"
      >
        <div class="login-page__button__google">
          <NmorphIcon>
            <NmorphIconGoogle />
          </NmorphIcon>
          <AppText :text="$t(LOGIN_FORM_I18N.withGoogle)" />
        </div>
      </NmorphButton>

      <div class="login-page__forgot">
        <RouterLink :to="ROUTE_NAMES.passwordRecovery">
          <AppText :text="$t(LOGIN_FORM_I18N.forgotPassword)" color="accent-color" />
        </RouterLink>
      </div>
    </div>
  </NmorphForm>
</template>

<style>
.login-page {
  display: grid;
  gap: 12px;
}

.login-page__google-icon {
  margin-right: 8px;
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
