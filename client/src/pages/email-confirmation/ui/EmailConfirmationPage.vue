<script setup lang="ts">
import { NmorphButton, NmorphProgress } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { AppHeader, AppText } from 'src/shared/ui'

import { EMAIL_CONFIRMATION_I18N } from '../config/i18n'
import { useEmailConfirmation } from '../model/use-email-confirmation.model'

const { confirmEmail, email, failureMessage, isConfirmed, isLoading, successMessage } = useEmailConfirmation()

onMounted(confirmEmail)
</script>

<template>
  <div class="email-confirmation-page">
    <template v-if="isLoading">
      <NmorphProgress type="circle" :percentage="35" :circle-size="64" indeterminate>
        <template #circle-inner-part />
      </NmorphProgress>
      <AppText :text="$t(EMAIL_CONFIRMATION_I18N.loading)" />
    </template>

    <template v-else>
      <AppHeader
        v-if="isConfirmed || failureMessage"
        :text="isConfirmed ? $t(EMAIL_CONFIRMATION_I18N.title) : failureMessage"
      />
      <AppText v-if="isConfirmed && successMessage" :text="successMessage" />
      <AppText v-if="isConfirmed && email" bold color="accent" :text="email" />
      <RouterLink custom :to="ROUTE_NAMES.authLogin" v-slot="{ navigate }">
        <NmorphButton
          :text="$t(EMAIL_CONFIRMATION_I18N.login)"
          class="email-confirmation-page__act-btn"
          @click="navigate"
        />
      </RouterLink>
    </template>
  </div>
</template>

<style>
.email-confirmation-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
}

.email-confirmation-page > * {
  margin-bottom: 8px;
}

.email-confirmation-page__act-btn {
  gap: 8px;
  margin-top: auto;
  margin-bottom: 16px;
}
</style>
