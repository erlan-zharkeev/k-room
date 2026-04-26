<script setup lang="ts">
import { ROUTE_NAMES } from 'global-shared'
import { Button } from 'primevue'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { PageLayout } from 'src/widgets/page-layout'

import { WAIT_EMAIL_CONFIRM_I18N } from '../config/i18n'
import { useWaitEmailConfirm } from '../model/use-wait-email-confirm'

const { attempts, counterValue, email, initializeWaitEmailConfirm, isLoading, isResendDisabled, resend } =
  useWaitEmailConfirm()

onMounted(initializeWaitEmailConfirm)
</script>

<template>
  <PageLayout
    :back-label="$t(WAIT_EMAIL_CONFIRM_I18N.back)"
    card-size="medium"
    :fallback-route="ROUTE_NAMES.login"
    :title="$t(WAIT_EMAIL_CONFIRM_I18N.title)"
  >
    <div class="wait-email-confirm-page__content">
      <p>{{ $t(WAIT_EMAIL_CONFIRM_I18N.sentToEmail) }}</p>
      <strong>{{ email }}</strong>
      <p>{{ $t(WAIT_EMAIL_CONFIRM_I18N.followLink) }}</p>
      <p v-if="attempts <= 0">{{ $t(WAIT_EMAIL_CONFIRM_I18N.attemptsExhausted) }}</p>
      <p v-else>{{ $t(WAIT_EMAIL_CONFIRM_I18N.attemptsLeft) }} {{ attempts }}</p>
      <p>{{ $t(WAIT_EMAIL_CONFIRM_I18N.resendHint) }}</p>
      <p v-if="counterValue > 0">{{ $t(WAIT_EMAIL_CONFIRM_I18N.resendInSeconds)(counterValue) }}</p>

      <Button
        :disabled="isResendDisabled"
        :label="$t(WAIT_EMAIL_CONFIRM_I18N.resend)"
        :loading="isLoading"
        @click="resend"
      />

      <RouterLink :to="ROUTE_NAMES.login">{{ $t(WAIT_EMAIL_CONFIRM_I18N.back) }}</RouterLink>
    </div>
  </PageLayout>
</template>

<style scoped>
.wait-email-confirm-page__content {
  display: grid;
  gap: 12px;
}

.wait-email-confirm-page__content p {
  margin: 0;
  color: var(--p-app-text-muted);
}

.wait-email-confirm-page__content strong,
.wait-email-confirm-page__content a {
  color: var(--p-primary-color);
}

.wait-email-confirm-page__content a {
  text-decoration: none;
}
</style>
