<script setup lang="ts">
import { ROUTE_NAMES } from 'global-shared'
import { Button } from 'primevue'
import { RouterLink } from 'vue-router'

import { PageLayout } from 'src/widgets/page-layout'

import { ERROR_PAGE_I18N } from '../config/i18n'
</script>

<template>
  <PageLayout
    :back-label="$t(ERROR_PAGE_I18N.back)"
    :fallback-route="ROUTE_NAMES.main"
    :title="$t(ERROR_PAGE_I18N.title)"
  >
    <div class="error-page__content">
      <p>{{ $t(ERROR_PAGE_I18N.description) }}</p>

      <RouterLink :to="ROUTE_NAMES.main">
        <Button :label="$t(ERROR_PAGE_I18N.toMain)" />
      </RouterLink>
    </div>
  </PageLayout>
</template>

<style scoped>
.error-page__content {
  display: grid;
  gap: 14px;
  justify-items: start;
}

.error-page__content p {
  margin: 0;
  color: var(--p-app-text-muted);
}
</style>
