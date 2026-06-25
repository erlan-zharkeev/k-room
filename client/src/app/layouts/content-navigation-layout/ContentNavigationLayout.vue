<script setup lang="ts">
import { NmorphText, NmorphCard } from '@nmorph/nmorph-ui-kit'

import { ROUTE_TITLE_MAP } from '../app-layout/constants'

import { type ContentNavigationLayoutProps } from './types'

const props = defineProps<ContentNavigationLayoutProps>()
</script>

<template>
  <section class="content-navigation-layout">
    <div v-if="props.titleKey" class="content-navigation-layout__header">
      <NmorphText as="h3" variant="title" weight="bold">{{ $t(ROUTE_TITLE_MAP[props.titleKey]) }}</NmorphText>
    </div>
    <NmorphCard shadow-type="inset" class="content-navigation-layout__content">
      <slot />
    </NmorphCard>
  </section>
</template>

<style lang="scss">
.content-navigation-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.content-navigation-layout__header {
  margin-bottom: 12px;
}

.content-navigation-layout__content {
  flex: 1 1 auto;
  min-height: 0;
  padding: 8px;
}
</style>
