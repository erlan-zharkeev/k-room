<script setup lang="ts">
import { ROUTE_NAMES } from 'global-shared'
import { Button, Card } from 'primevue'
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import { COMMON_I18N } from 'src/shared/config'
import { AppHeader, AppLogo } from 'src/shared/ui'

import type { PageLayoutPropsType } from './types'

const route = useRoute()
const router = useRouter()
const layoutProps = computed<PageLayoutPropsType>(() => route.meta.pageLayout ?? {})
const fallbackRoute = computed(() => layoutProps.value.fallbackRoute ?? ROUTE_NAMES.app)

const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.replace(fallbackRoute.value)
}
</script>

<template>
  <section class="page-layout">
    <Button
      icon="pi pi-angle-left"
      size="small"
      :label="$t(COMMON_I18N.back)"
      severity="secondary"
      @click="handleBack"
    />
    <Card class="page-layout__card">
      <template v-if="layoutProps.title" #title>
        <AppLogo />
        <AppHeader :text="$t(layoutProps.title)" />
      </template>
      <template #content>
        <article class="page-layout__content">
          <slot>
            <RouterView />
          </slot>
        </article>
      </template>
    </Card>
  </section>
</template>

<style lang="scss">
.page-layout__card {
  overflow: auto;
  max-height: 95%;
  padding: 12px 0;
  @include absolute-center;
}
</style>
