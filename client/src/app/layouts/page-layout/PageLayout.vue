<script setup lang="ts">
import { NmorphButton, NmorphCard, NmorphIconArrowLeft } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import { AppHeader, AppLogo } from 'src/shared/ui'

import { PAGE_LAYOUT_I18N } from './i18n'
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
    <NmorphButton :text="$t(PAGE_LAYOUT_I18N.back)" style-type="transparent" @click="handleBack">
      <template #icon>
        <NmorphIconArrowLeft />
      </template>
    </NmorphButton>
    <NmorphCard class="page-layout__card">
      <template v-if="layoutProps.title" #header>
        <div class="page-layout__title">
          <AppLogo />
          <AppHeader :text="$t(layoutProps.title)" />
        </div>
      </template>
      <article class="page-layout__content">
        <slot>
          <RouterView />
        </slot>
      </article>
    </NmorphCard>
  </section>
</template>

<style lang="scss">
.page-layout__card {
  overflow: auto;
  max-height: 95%;
  padding: 12px 0;
  @include absolute-center;
}

.page-layout__title {
  display: grid;
  gap: 8px;
  justify-items: center;
}
</style>
