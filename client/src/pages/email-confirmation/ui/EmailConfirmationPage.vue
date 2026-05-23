<script setup lang="ts">
import { NmorphButton, NmorphProgress } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { AppHeader, AppText } from 'src/shared/ui'

import { EMAIL_CONFIRMATION_I18N } from '../config/i18n'
import { useEmailConfirmation } from '../model/use-email-confirmation.model'

const { confirmEmail, email, failureMessage, isConfirmed, isLoading } = useEmailConfirmation()

onMounted(confirmEmail)
</script>

<template>
  <div class="email-confirmation-page">
    <div v-if="isLoading" class="email-confirmation-page__loader">
      <NmorphProgress type="circle" :percentage="35" :circle-size="64" indeterminate>
        <template #circle-inner-part />
      </NmorphProgress>
      <AppText :text="$t(EMAIL_CONFIRMATION_I18N.loading)" />
    </div>

    <div v-else class="email-confirmation-page__content">
      <AppHeader :text="isConfirmed ? $t(EMAIL_CONFIRMATION_I18N.title) : failureMessage" />
      <AppText v-if="isConfirmed" :text="`Email ${email} ${$t(EMAIL_CONFIRMATION_I18N.confirmed)}`" />
      <RouterLink custom :to="ROUTE_NAMES.authLogin" v-slot="{ navigate }">
        <NmorphButton
          :text="$t(EMAIL_CONFIRMATION_I18N.back)"
          class="email-confirmation-page__act-btn"
          @click="navigate"
        />
      </RouterLink>
    </div>
  </div>
</template>

<style>
.email-confirmation-page__act-btn {
  gap: 8px;
}
</style>
