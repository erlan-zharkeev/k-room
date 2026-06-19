<script setup lang="ts">
import { NmorphCard, NmorphScroll } from '@nmorph/nmorph-ui-kit'

import { ContentNavigationBackButton } from 'src/features/content-navigation-back-button'
import { SETTINGS_CONTENT_TITLE } from 'src/pages/settings'
import { AppHeader } from 'src/shared/ui'

import { type ContentLayoutProps } from './types'
import { useContentLayout } from './use-content-layout.model'

const props = defineProps<ContentLayoutProps>()
const { isPortraitTabletOrLess, showHeader } = useContentLayout(props)
</script>

<template>
  <section class="content-layout">
    <div v-if="showHeader" class="content-layout__header">
      <ContentNavigationBackButton v-if="isPortraitTabletOrLess" />
      <AppHeader v-if="props.titleKey" :text="$t(SETTINGS_CONTENT_TITLE[props.titleKey])" />
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
