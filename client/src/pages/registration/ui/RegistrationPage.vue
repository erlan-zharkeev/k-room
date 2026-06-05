<script setup lang="ts">
import { NmorphButton, NmorphForm, NmorphFormItem, NmorphSwitch, NmorphTextInput } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES, SECURITY_ACTION } from 'global-shared'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { AppCaptcha, AppText } from 'src/shared/ui'

import { REGISTRATION_NICKNAME_INPUT_ATTRS } from '../config/constants'
import { REGISTRATION_FORM_I18N } from '../config/i18n'
import { useRegistration } from '../model/use-registration.model'

const { captchaRequired, captchaResetKey, captchaToken, formData, isFormValid, isLoading, submit } = useRegistration()
const isFormDisabled = computed(() => isLoading.value)
const isCaptchaBlocked = computed(() => captchaRequired.value && !captchaToken.value)
const isSubmitDisabled = computed(() => isFormDisabled.value || isCaptchaBlocked.value)
</script>

<template>
  <NmorphForm ref="formRef" :value="formData" class="registration-page" @submit.prevent="submit">
    <NmorphFormItem id="nickname" :show-validation-icon="false">
      <NmorphTextInput
        v-model.trim="formData.nickname.value"
        :disabled="isFormDisabled"
        :input-attrs="REGISTRATION_NICKNAME_INPUT_ATTRS"
        :placeholder="$t(REGISTRATION_FORM_I18N.nicknamePlaceholder)"
        clearable
      />
    </NmorphFormItem>

    <NmorphFormItem id="email" :show-validation-icon="false">
      <NmorphTextInput
        autocomplete="email"
        :disabled="isFormDisabled"
        :placeholder="$t(REGISTRATION_FORM_I18N.emailPlaceholder)"
        clearable
      />
    </NmorphFormItem>

    <NmorphFormItem id="password" :show-validation-icon="false">
      <NmorphTextInput
        autocomplete="new-password"
        :disabled="isFormDisabled"
        :placeholder="$t(REGISTRATION_FORM_I18N.passwordPlaceholder)"
        type-password
      />
    </NmorphFormItem>

    <NmorphFormItem id="policy" :show-validation-icon="false">
      <div class="registration-page__policy">
        <NmorphSwitch :disabled="isFormDisabled" />
        <span>
          <AppText tag="span" :text="$t(REGISTRATION_FORM_I18N.agreement)" />
          <RouterLink :to="ROUTE_NAMES.privacyPolicy">
            <AppText tag="span" :text="$t(REGISTRATION_FORM_I18N.link)" color="accent" />
          </RouterLink>
        </span>
      </div>
    </NmorphFormItem>

    <AppCaptcha
      v-if="captchaRequired"
      :action="SECURITY_ACTION.registration"
      v-model="captchaToken"
      :reset-key="captchaResetKey"
    />

    <NmorphButton
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
