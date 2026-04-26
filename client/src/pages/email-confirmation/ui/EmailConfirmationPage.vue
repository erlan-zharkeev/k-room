<script setup lang="ts">
import { ROUTE_NAMES } from 'global-shared'
import { Button, ProgressSpinner } from 'primevue'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { PageLayout } from 'src/widgets/page-layout'

import { EMAIL_CONFIRMATION_I18N } from '../config/i18n'
import { useEmailConfirmation } from '../model/use-email-confirmation'

const { confirmEmail, email, isLoading } = useEmailConfirmation()

onMounted(confirmEmail)
</script>

<template>
  <PageLayout
    :back-label="$t(EMAIL_CONFIRMATION_I18N.back)"
    :fallback-route="ROUTE_NAMES.login"
    :title="$t(EMAIL_CONFIRMATION_I18N.title)"
  >
    <div v-if="isLoading" class="email-confirmation-page__loader">
      <ProgressSpinner />
      <span>{{ $t(EMAIL_CONFIRMATION_I18N.loading) }}</span>
    </div>

    <div v-else class="email-confirmation-page__content">
      <p>
        {{ $t(EMAIL_CONFIRMATION_I18N.email) }}
        <strong>{{ email }}</strong>
        {{ $t(EMAIL_CONFIRMATION_I18N.confirmed) }}
      </p>
      <RouterLink :to="ROUTE_NAMES.login">
        <Button :label="$t(EMAIL_CONFIRMATION_I18N.back)" />
      </RouterLink>
    </div>
  </PageLayout>
</template>

<style scoped>
.email-confirmation-page__loader,
.email-confirmation-page__content {
  display: grid;
  gap: 14px;
  justify-items: center;
  text-align: center;
}

.email-confirmation-page__content p {
  margin: 0;
}

.email-confirmation-page__content strong {
  color: var(--p-primary-color);
}
</style>
