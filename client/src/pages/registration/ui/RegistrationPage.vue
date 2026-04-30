<script setup lang="ts">
import { Form } from '@primevue/forms'
import { ROUTE_NAMES, SECURITY_ACTION } from 'global-shared'
import { Button, Checkbox, InputText, Message, Password } from 'primevue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { isFormFieldInvalid } from 'src/shared/lib'
import { AppCaptcha, AppText } from 'src/shared/ui'

import { PRIVACY_POLICY_SWITCH_I18N, REGISTRATION_FORM_I18N } from '../config/i18n'
import { useRegistration } from '../model/use-registration'

const { captchaRequired, captchaResetKey, captchaToken, formData, isLoading, resolver, submit } = useRegistration()
const isCaptchaBlocked = computed(() => captchaRequired.value && !captchaToken.value)
const isSubmitDisabled = computed(() => isLoading.value || isCaptchaBlocked.value)
</script>

<template>
  <Form v-slot="$form" :initial-values="formData" :resolver="resolver" class="registration-page" @submit="submit">
    <div class="registration-page__field">
      <InputText
        v-model.trim="formData.nickname"
        autocomplete="nickname"
        :disabled="isLoading"
        fluid
        name="nickname"
        :placeholder="$t(REGISTRATION_FORM_I18N.nicknamePlaceholder)"
        size="small"
      />
      <Message v-if="isFormFieldInvalid($form.nickname)" severity="error" size="small" variant="simple">
        {{ $form.nickname.error?.message }}
      </Message>
    </div>

    <div class="registration-page__field">
      <InputText
        v-model.trim="formData.email"
        autocomplete="email"
        :disabled="isLoading"
        fluid
        name="email"
        placeholder="Email"
        size="small"
        type="email"
      />
      <Message v-if="isFormFieldInvalid($form.email)" severity="error" size="small" variant="simple">
        {{ $form.email.error?.message }}
      </Message>
    </div>

    <div class="registration-page__field">
      <Password
        v-model="formData.password"
        :disabled="isLoading"
        :feedback="false"
        fluid
        autocomplete="new-password"
        name="password"
        :placeholder="$t(REGISTRATION_FORM_I18N.passwordPlaceholder)"
        size="small"
        toggle-mask
      />
      <Message v-if="isFormFieldInvalid($form.password)" severity="error" size="small" variant="simple">
        {{ $form.password.error?.message }}
      </Message>
    </div>

    <div class="registration-page__field">
      <label class="registration-page__policy">
        <Checkbox
          v-model="formData.policy"
          binary
          :disabled="isLoading"
          input-id="registration-policy"
          name="policy"
          size="small"
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
      <Message v-if="isFormFieldInvalid($form.policy)" severity="error" size="small" variant="simple">
        {{ $form.policy.error?.message }}
      </Message>
    </div>

    <AppCaptcha
      v-if="captchaRequired"
      :action="SECURITY_ACTION.registration"
      v-model="captchaToken"
      :reset-key="captchaResetKey"
    />

    <Button
      class="registration-page__submit"
      :disabled="isSubmitDisabled || !$form.valid"
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
