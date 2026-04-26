<script setup lang="ts">
import { Form } from '@primevue/forms'
import { ROUTE_NAMES } from 'global-shared'
import { Button, Checkbox, InputText, Message, Password } from 'primevue'
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'

import { AppText } from 'src/shared/ui'

import { PRIVACY_POLICY_SWITCH_I18N, REGISTRATION_FORM_I18N } from '../config/i18n'
import { useRegistration } from '../model/use-registration'
import { useRegistrationForm } from '../model/use-registration-form'

const { isLoading, onRegister } = useRegistration()
const registrationFormProps = reactive({ isLoading, onRegister })
const {
  emailErrorText,
  formData,
  isEmailInvalid,
  isPasswordInvalid,
  isPolicyInvalid,
  isSubmitDisabled,
  isUsernameInvalid,
  passwordErrorText,
  policyErrorText,
  resolver,
  submit,
  touchField,
  usernameErrorText
} = useRegistrationForm(registrationFormProps)
</script>

<template>
  <Form :initial-values="formData" :resolver="resolver" class="registration-page" @submit="submit">
    <div class="registration-page__field">
      <InputText
        v-model="formData.username"
        autocomplete="username"
        :disabled="isLoading"
        fluid
        :invalid="isUsernameInvalid"
        name="username"
        :placeholder="$t(REGISTRATION_FORM_I18N.usernamePlaceholder)"
        size="small"
        @blur="touchField('username')"
        @update:model-value="touchField('username')"
      />
      <Message v-if="usernameErrorText" severity="error" size="small" variant="simple">
        {{ usernameErrorText }}
      </Message>
    </div>

    <div class="registration-page__field">
      <InputText
        v-model="formData.email"
        autocomplete="email"
        :disabled="isLoading"
        fluid
        :invalid="isEmailInvalid"
        name="email"
        placeholder="Email"
        size="small"
        type="email"
        @blur="touchField('email')"
        @update:model-value="touchField('email')"
      />
      <Message v-if="emailErrorText" severity="error" size="small" variant="simple">
        {{ emailErrorText }}
      </Message>
    </div>

    <div class="registration-page__field">
      <Password
        v-model="formData.password"
        :disabled="isLoading"
        :feedback="false"
        fluid
        :invalid="isPasswordInvalid"
        autocomplete="new-password"
        name="password"
        :placeholder="$t(REGISTRATION_FORM_I18N.passwordPlaceholder)"
        size="small"
        toggle-mask
        @blur="touchField('password')"
        @update:model-value="touchField('password')"
      />
      <Message v-if="passwordErrorText" severity="error" size="small" variant="simple">
        {{ passwordErrorText }}
      </Message>
    </div>

    <div class="registration-page__field">
      <label class="registration-page__policy">
        <Checkbox
          v-model="formData.policy"
          binary
          :disabled="isLoading"
          :invalid="isPolicyInvalid"
          input-id="registration-policy"
          name="policy"
          size="small"
          @change="touchField('policy')"
        />
        <AppText
          class="registration-page__policy-text"
          :class="{ 'registration-page__policy-text--disabled': isLoading }"
        >
          {{ $t(PRIVACY_POLICY_SWITCH_I18N.agreement) }}
          <RouterLink :to="ROUTE_NAMES.privacyPolicy">
            <AppText :text="$t(PRIVACY_POLICY_SWITCH_I18N.link)" color="accent-color" />
          </RouterLink>
        </AppText>
      </label>
      <Message v-if="policyErrorText" severity="error" size="small" variant="simple">
        {{ policyErrorText }}
      </Message>
    </div>

    <Button
      class="registration-page__submit"
      :disabled="isSubmitDisabled"
      fluid
      :label="$t(REGISTRATION_FORM_I18N.submit)"
      :loading="isLoading"
      size="small"
      type="submit"
    />
  </Form>
</template>

<style lang="scss">
.registration-page {
  display: grid;
  gap: 12px;
}

.registration-page__policy {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
}

.registration-page__policy-text--disabled {
  @include disabled-state;
}
</style>
