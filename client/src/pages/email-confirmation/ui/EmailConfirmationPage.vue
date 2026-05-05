<script setup lang="ts">
import { ROUTE_NAMES } from 'global-shared'
import { Button, ProgressSpinner } from 'primevue'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { COMMON_I18N } from 'src/shared/config'
import { AppHeader, AppText } from 'src/shared/ui'

import { EMAIL_CONFIRMATION_I18N } from '../config/i18n'
import { useEmailConfirmation } from '../model/use-email-confirmation'

const { confirmEmail, email, isConfirmed, isLoading } = useEmailConfirmation()

onMounted(confirmEmail)
</script>

<template>
  <div class="email-confirmation-page">
    <div v-if="isLoading" class="email-confirmation-page__loader">
      <ProgressSpinner />
      <AppText :text="$t(EMAIL_CONFIRMATION_I18N.loading)" />
    </div>

    <div v-else class="email-confirmation-page__content">
      <AppHeader :text="$t(isConfirmed ? EMAIL_CONFIRMATION_I18N.title : EMAIL_CONFIRMATION_I18N.failed)" />
      <AppText v-if="isConfirmed" :text="`Email ${email} ${$t(EMAIL_CONFIRMATION_I18N.confirmed)}`" />
      <RouterLink custom :to="ROUTE_NAMES.authLogin" v-slot="{ href, navigate }">
        <Button
          as="a"
          :href="href"
          :label="$t(COMMON_I18N.back)"
          size="small"
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
