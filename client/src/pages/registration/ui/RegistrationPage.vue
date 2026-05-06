<script setup lang="ts">
import { NmorphButton, NmorphForm, NmorphFormItem, NmorphSwitch, NmorphTextInput } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES, SECURITY_ACTION } from 'global-shared'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { AppCaptcha, AppText } from 'src/shared/ui'

import { REGISTRATION_FORM_I18N } from '../config/i18n'
import { useRegistration } from '../model/use-registration'

const { captchaRequired, captchaResetKey, captchaToken, formData, formRef, isFormValid, isLoading, submit } =
  useRegistration()
const isFormDisabled = computed(() => isLoading.value)
const isCaptchaBlocked = computed(() => captchaRequired.value && !captchaToken.value)
const isSubmitDisabled = computed(() => isFormDisabled.value || isCaptchaBlocked.value)
</script>

<template>
  <NmorphForm ref="formRef" :value="formData" class="registration-page" @submit.prevent="submit">
    <NmorphFormItem id="nickname" class="registration-page__field" :show-validation-icon="false">
      <NmorphTextInput
        v-model="formData.nickname.value"
        class="registration-page__input"
        :disabled="isFormDisabled"
        :placeholder="$t(REGISTRATION_FORM_I18N.nicknamePlaceholder)"
        clearable
      />
    </NmorphFormItem>

    <NmorphFormItem id="email" class="registration-page__field" :show-validation-icon="false">
      <NmorphTextInput
        v-model="formData.email.value"
        autocomplete="email"
        class="registration-page__input"
        :disabled="isFormDisabled"
        :placeholder="$t(REGISTRATION_FORM_I18N.emailPlaceholder)"
        clearable
      />
    </NmorphFormItem>

    <NmorphFormItem id="password" class="registration-page__field" :show-validation-icon="false">
      <NmorphTextInput
        v-model="formData.password.value"
        autocomplete="new-password"
        class="registration-page__input"
        :disabled="isFormDisabled"
        :placeholder="$t(REGISTRATION_FORM_I18N.passwordPlaceholder)"
        type-password
      />
    </NmorphFormItem>

    <NmorphFormItem id="policy" class="registration-page__field" :show-validation-icon="false">
      <div class="registration-page__policy">
        <NmorphSwitch v-model="formData.policy.value" :disabled="isFormDisabled" />
        <div class="registration-page__policy-text">
          <AppText tag="span" :text="$t(REGISTRATION_FORM_I18N.agreement)" />
          <RouterLink class="registration-page__policy-link" :to="ROUTE_NAMES.privacyPolicy">
            <AppText tag="span" :text="$t(REGISTRATION_FORM_I18N.link)" color="accent" />
          </RouterLink>
        </div>
      </div>
    </NmorphFormItem>

    <AppCaptcha
      v-if="captchaRequired"
      :action="SECURITY_ACTION.registration"
      v-model="captchaToken"
      :reset-key="captchaResetKey"
    />

    <NmorphButton
      class="registration-page__button"
      :disabled="isSubmitDisabled || !isFormValid"
      fill
      :loading="isLoading"
      :text="$t(REGISTRATION_FORM_I18N.submit)"
      type="submit"
    />
  </NmorphForm>
</template>

<style>
.registration-page {
  display: grid;
  gap: 12px;
}

.registration-page__policy {
  display: flex;
  gap: 12px;
}
</style>
