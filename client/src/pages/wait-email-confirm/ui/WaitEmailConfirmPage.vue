<script setup lang="ts">
import { NmorphText, NmorphButton } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { AppCaptcha } from 'src/shared/ui'

import { WAIT_EMAIL_CONFIRM_I18N } from '../config/i18n'
import { useWaitEmailConfirm } from '../model/use-wait-email-confirm.model'

const { attempts, captcha, counterValue, email, initializeWaitEmailConfirm, isLoading, isResendDisabled, resend } =
  useWaitEmailConfirm()
const { captchaRequired, captchaToken, captchaResetKey } = captcha

onMounted(initializeWaitEmailConfirm)
</script>

<template>
  <div class="wait-email-confirm-page">
    <NmorphText as="h3" variant="title" weight="bold">{{ $t(WAIT_EMAIL_CONFIRM_I18N.title) }}</NmorphText>

    <NmorphText as="p">{{ $t(WAIT_EMAIL_CONFIRM_I18N.sentToEmail) }}</NmorphText>
    <NmorphText color="accent" weight="bold">{{ email }}</NmorphText>
    <NmorphText as="p">{{ $t(WAIT_EMAIL_CONFIRM_I18N.followLink) }}</NmorphText>
    <NmorphText v-if="attempts <= 0" as="p">{{ $t(WAIT_EMAIL_CONFIRM_I18N.attemptsExhausted) }}</NmorphText>
    <NmorphText v-else as="p">{{ `${$t(WAIT_EMAIL_CONFIRM_I18N.attemptsLeft)} ${attempts}` }}</NmorphText>
    <NmorphText as="p">{{ $t(WAIT_EMAIL_CONFIRM_I18N.resendHint) }}</NmorphText>
    <NmorphText v-if="counterValue > 0" as="p">{{
      $t(WAIT_EMAIL_CONFIRM_I18N.resendInSeconds, { seconds: counterValue })
    }}</NmorphText>

    <AppCaptcha
      v-if="captchaRequired"
      :action="'send-confirmation-link'"
      v-model="captchaToken"
      :reset-key="captchaResetKey"
    />

    <div class="wait-email-confirm-page__action-btns">
      <NmorphButton
        :disabled="isResendDisabled"
        :loading="isLoading"
        :text="$t(WAIT_EMAIL_CONFIRM_I18N.resend)"
        @click="resend"
      />

      <RouterLink custom :to="ROUTE_NAMES.authLogin" v-slot="{ navigate }">
        <NmorphButton :text="$t(WAIT_EMAIL_CONFIRM_I18N.login)" design="plain" borderless @click="navigate" />
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.wait-email-confirm-page {
  display: grid;
  gap: 12px;
}

.wait-email-confirm-page__action-btns {
  display: flex;
  gap: 8px;
}
</style>
