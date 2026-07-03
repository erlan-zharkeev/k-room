<script setup lang="ts">
import { NmorphText, NmorphButton, NmorphProgress } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

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
      <NmorphText>{{ $t(EMAIL_CONFIRMATION_I18N.loading) }}</NmorphText>
    </template>

    <template v-else>
      <NmorphText as="h3" v-if="isConfirmed || failureMessage" variant="title" weight="bold">{{
        isConfirmed ? $t(EMAIL_CONFIRMATION_I18N.title) : failureMessage
      }}</NmorphText>
      <NmorphText v-if="isConfirmed && successMessage">{{ successMessage }}</NmorphText>
      <NmorphText v-if="isConfirmed && email" color="accent" weight="bold">{{ email }}</NmorphText>
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

<style scoped>
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
