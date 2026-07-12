<script setup lang="ts">
import { NmorphText, NmorphCard } from '@nmorph/nmorph-ui-kit'

import { socketDataStatus } from 'src/shared/api'
import { AppLoadingProgress } from 'src/shared/ui'

import { ROUTE_TITLE_MAP } from '../app-layout/constants'

import { type ContentNavigationLayoutProps } from './types'

const props = defineProps<ContentNavigationLayoutProps>()
const { isLoading: isSocketDataLoading } = socketDataStatus
</script>

<template>
  <section class="content-navigation-layout">
    <div v-if="props.titleKey" class="content-navigation-layout__header">
      <NmorphText as="h3" variant="title" weight="bold">{{ $t(ROUTE_TITLE_MAP[props.titleKey]) }}</NmorphText>
    </div>
    <NmorphCard shadow-type="inset" class="content-navigation-layout__content">
      <AppLoadingProgress
        v-if="isSocketDataLoading"
        class="content-navigation-layout__loading-progress"
        aria-hidden="true"
      />
      <slot />
    </NmorphCard>
  </section>
</template>

<style lang="scss" scoped>
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
  position: relative;

  overflow: hidden;
  flex: 1 1 auto;

  min-height: 0;
  padding: 8px;
}

.content-navigation-layout__loading-progress {
  position: absolute;
  z-index: 2;
  top: -8px;
  right: -8px;
  left: -8px;
}
</style>
