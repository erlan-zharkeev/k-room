<script setup lang="ts">
import { ROUTE_NAMES } from 'global-shared'
import { Button, Checkbox, InputText, Password } from 'primevue'
import { RouterLink } from 'vue-router'

import { PRIVACY_POLICY_SWITCH_I18N, REGISTRATION_FORM_I18N } from '../../config/i18n'
import type { IRegistrationFormProps } from '../../model/types'
import { useRegistrationForm } from '../../model/use-registration-form'

const props = defineProps<IRegistrationFormProps>()
const { formData, getFirstErrorText, isSubmitDisabled, submit, touchField, visibleErrors } = useRegistrationForm(props)
</script>

<template>
  <form class="registration-form" novalidate @submit.prevent="submit">
    <div class="registration-form__field">
      <InputText
        v-model="formData.username"
        autocomplete="username"
        :disabled="props.isLoading"
        :invalid="Boolean(visibleErrors.username?.length)"
        :placeholder="$t(REGISTRATION_FORM_I18N.usernamePlaceholder)"
        @blur="touchField('username')"
        @update:model-value="touchField('username')"
      />
      <small class="registration-form__error">
        {{ getFirstErrorText('username') }}
      </small>
    </div>

    <div class="registration-form__field">
      <InputText
        v-model="formData.email"
        autocomplete="email"
        :disabled="props.isLoading"
        :invalid="Boolean(visibleErrors.email?.length)"
        :placeholder="$t(REGISTRATION_FORM_I18N.emailPlaceholder)"
        type="email"
        @blur="touchField('email')"
        @update:model-value="touchField('email')"
      />
      <small class="registration-form__error">
        {{ getFirstErrorText('email') }}
      </small>
    </div>

    <div class="registration-form__field">
      <Password
        v-model="formData.password"
        :disabled="props.isLoading"
        :feedback="false"
        :invalid="Boolean(visibleErrors.password?.length)"
        autocomplete="new-password"
        :placeholder="$t(REGISTRATION_FORM_I18N.passwordPlaceholder)"
        toggle-mask
        @blur="touchField('password')"
        @update:model-value="touchField('password')"
      />
      <small class="registration-form__error">
        {{ getFirstErrorText('password') }}
      </small>
    </div>

    <div class="registration-form__field">
      <label class="registration-form__policy">
        <Checkbox
          v-model="formData.policy"
          binary
          :disabled="props.isLoading"
          :invalid="Boolean(visibleErrors.policy?.length)"
          input-id="registration-policy"
          @change="touchField('policy')"
        />
        <span
          class="registration-form__policy-text"
          :class="{ 'registration-form__policy-text--disabled': props.isLoading }"
        >
          {{ $t(PRIVACY_POLICY_SWITCH_I18N.agreement) }}
          <RouterLink :to="ROUTE_NAMES.privacyPolicy">{{ $t(PRIVACY_POLICY_SWITCH_I18N.link) }}</RouterLink>
        </span>
      </label>
      <small class="registration-form__error">
        {{ getFirstErrorText('policy') }}
      </small>
    </div>

    <Button
      class="registration-form__submit"
      :disabled="isSubmitDisabled"
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

.registration-form__field {
  display: grid;
  gap: 4px;
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

.registration-form__error {
  min-height: 16px;
  font-size: 0.78rem;
  line-height: 1.2;
  color: var(--error);
}

.registration-form__policy-text {
  font-size: 0.9rem;
  color: var(--text);
}

.registration-form__policy-text--disabled {
  opacity: 0.7;
}

.registration-form__policy-text a {
  color: var(--accent);
  text-decoration: none;
}

.registration-form__policy-text a:hover {
  text-decoration: underline;
}
</style>
