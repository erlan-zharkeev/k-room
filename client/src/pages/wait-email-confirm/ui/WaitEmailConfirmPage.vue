<script setup lang="ts">
import { ROUTE_NAMES } from 'global-shared'
import { Button } from 'primevue'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { AppText } from 'src/shared/ui'

import { WAIT_EMAIL_CONFIRM_I18N } from '../config/i18n'
import { useWaitEmailConfirm } from '../model/use-wait-email-confirm'

const { attempts, counterValue, email, initializeWaitEmailConfirm, isLoading, isResendDisabled, resend } =
  useWaitEmailConfirm()

onMounted(initializeWaitEmailConfirm)
</script>

<template>
  <div class="wait-email-confirm-page">
    <AppText tag="p" :text="$t(WAIT_EMAIL_CONFIRM_I18N.sentToEmail)" />
    <AppText bold color="accent-color" :text="email" />
    <AppText tag="p" :text="$t(WAIT_EMAIL_CONFIRM_I18N.followLink)" />
    <AppText v-if="attempts <= 0" tag="p" :text="$t(WAIT_EMAIL_CONFIRM_I18N.attemptsExhausted)" />
    <AppText v-else tag="p" :text="`${$t(WAIT_EMAIL_CONFIRM_I18N.attemptsLeft)} ${attempts}`" />
    <AppText tag="p" :text="$t(WAIT_EMAIL_CONFIRM_I18N.resendHint)" />
    <AppText v-if="counterValue > 0" tag="p" :text="$t(WAIT_EMAIL_CONFIRM_I18N.resendInSeconds)(counterValue)" />

    <div class="wait-email-confirm-page__action-btns">
      <Button
        :disabled="isResendDisabled"
        :label="$t(WAIT_EMAIL_CONFIRM_I18N.resend)"
        :loading="isLoading"
        size="small"
        @click="resend"
      />

      <RouterLink custom :to="ROUTE_NAMES.authLogin" v-slot="{ href, navigate }">
        <Button
          as="a"
          :href="href"
          :label="$t(WAIT_EMAIL_CONFIRM_I18N.back)"
          severity="secondary"
          size="small"
          @click="navigate"
        />
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
