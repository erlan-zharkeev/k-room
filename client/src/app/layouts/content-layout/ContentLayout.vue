<script setup lang="ts">
import { NmorphText, NmorphCard, NmorphScroll } from '@nmorph/nmorph-ui-kit'

import { ContentNavigationBackButton } from 'src/features/content-navigation-back-button'
import { SETTINGS_CONTENT_TITLE } from 'src/pages/settings'

import { type ContentLayoutProps } from './types'
import { useContentLayout } from './use-content-layout.model'

const props = defineProps<ContentLayoutProps>()
const { isPortraitTabletOrLess, showHeader } = useContentLayout(props)
</script>

<template>
  <section class="content-layout">
    <div v-if="showHeader" class="content-layout__header">
      <ContentNavigationBackButton v-if="isPortraitTabletOrLess" />
      <NmorphText as="h3" v-if="props.titleKey" variant="title" weight="bold">{{
        $t(SETTINGS_CONTENT_TITLE[props.titleKey])
      }}</NmorphText>
    </div>
    <NmorphCard shadow-type="inset" class="content-layout__content">
      <NmorphScroll>
        <slot />
      </NmorphScroll>
    </NmorphCard>
  </section>
</template>

<style lang="scss">
.content-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.content-layout__header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.content-layout__content {
  flex: 1 1 auto;
  min-height: 0;
}
</style>
