<script setup lang="ts">
import clone from 'lodash/clone'
import { Button, Checkbox, InputText, Password } from 'primevue'
import { reactive } from 'vue'

import { DEFAULT_REGISTRATION_FORM_DATA } from '../../../config/constants'
import { REGISTRATION_FORM_I18N } from '../../../config/registration-form-i18n'
import { REGISTRATION_FORM_RULES } from '../../../config/rules'
import PrivacyPolicySwitch from '../PrivacyPolicySwitch/PrivacyPolicySwitch.vue'
import type { IRegistrationFormProps } from '../types'

const props = defineProps<IRegistrationFormProps>()
const formData = reactive(clone(DEFAULT_REGISTRATION_FORM_DATA))
</script>

<template>
  <form class="registration-form" @submit.prevent="props.onRegister(formData)">
    <InputText
      v-model="formData.username"
      v-bind="REGISTRATION_FORM_RULES.username"
      autocomplete="username"
      :placeholder="$t(REGISTRATION_FORM_I18N.usernamePlaceholder)"
    />
    <InputText
      v-model="formData.email"
      v-bind="REGISTRATION_FORM_RULES.email"
      autocomplete="email"
      :placeholder="$t(REGISTRATION_FORM_I18N.emailPlaceholder)"
      type="email"
    />
    <Password
      v-model="formData.password"
      v-bind="REGISTRATION_FORM_RULES.password"
      :feedback="false"
      autocomplete="new-password"
      :placeholder="$t(REGISTRATION_FORM_I18N.passwordPlaceholder)"
      toggle-mask
    />

    <label class="registration-form__policy">
      <Checkbox
        v-model="formData.policy"
        v-bind="REGISTRATION_FORM_RULES.policy"
        binary
        :disabled="props.isLoading"
        input-id="registration-policy"
      />
      <PrivacyPolicySwitch :disabled="props.isLoading" />
    </label>

    <Button
      class="registration-form__submit"
      :label="$t(REGISTRATION_FORM_I18N.submit)"
      :loading="props.isLoading"
      type="submit"
    />
  </form>
</template>

<style scoped>
.registration-form {
  display: grid;
  gap: 12px;
}

.registration-form :deep(.p-inputtext),
.registration-form :deep(.p-password),
.registration-form :deep(.p-password-input),
.registration-form :deep(.p-button) {
  width: 100%;
}

.registration-form__policy {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  align-items: start;
}

.registration-form__submit {
  margin-top: 4px;
}
</style>
