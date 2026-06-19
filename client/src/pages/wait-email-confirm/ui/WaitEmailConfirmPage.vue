<script setup lang="ts">
import { NmorphButton } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { AppCaptcha, AppHeader, AppText } from 'src/shared/ui'

import { WAIT_EMAIL_CONFIRM_I18N } from '../config/i18n'
import { useWaitEmailConfirm } from '../model/use-wait-email-confirm.model'

const { attempts, captcha, counterValue, email, initializeWaitEmailConfirm, isLoading, isResendDisabled, resend } =
  useWaitEmailConfirm()
const { captchaRequired, captchaToken, captchaResetKey } = captcha

onMounted(initializeWaitEmailConfirm)
</script>

<template>
  <div class="wait-email-confirm-page">
    <AppHeader :text="$t(WAIT_EMAIL_CONFIRM_I18N.title)" />

    <AppText tag="p" :text="$t(WAIT_EMAIL_CONFIRM_I18N.sentToEmail)" />
    <AppText bold color="accent" :text="email" />
    <AppText tag="p" :text="$t(WAIT_EMAIL_CONFIRM_I18N.followLink)" />
    <AppText v-if="attempts <= 0" tag="p" :text="$t(WAIT_EMAIL_CONFIRM_I18N.attemptsExhausted)" />
    <AppText v-else tag="p" :text="`${$t(WAIT_EMAIL_CONFIRM_I18N.attemptsLeft)} ${attempts}`" />
    <AppText tag="p" :text="$t(WAIT_EMAIL_CONFIRM_I18N.resendHint)" />
    <AppText
      v-if="counterValue > 0"
      tag="p"
      :text="$t(WAIT_EMAIL_CONFIRM_I18N.resendInSeconds, { seconds: counterValue })"
    />

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
        <NmorphButton :text="$t(WAIT_EMAIL_CONFIRM_I18N.back)" design="plain" borderless @click="navigate" />
      </RouterLink>
    </div>
  </div>
</template>

<style>
.wait-email-confirm-page {
  display: grid;
  gap: 12px;
}

.wait-email-confirm-page__action-btns {
  display: flex;
  gap: 8px;
}
</style>
