<script setup lang="ts">
import { NmorphScroll } from '@nmorph/nmorph-ui-kit'

import { AppHeader } from 'src/shared/ui'

import { CONTENT_NAVIGATION_TITLE } from './constants'
import { IContentNavigationLayoutProps } from './types'

const props = defineProps<IContentNavigationLayoutProps>()
</script>

<template>
  <section class="content-navigation-layout">
    <div v-if="props.titleKey" class="content-navigation-layout__header">
      <AppHeader :text="$t(CONTENT_NAVIGATION_TITLE[props.titleKey])" />
    </div>
    <div class="content-navigation-layout__content nmorph--shadow-inset">
      <NmorphScroll height="100%">
        <slot />
      </NmorphScroll>
    </div>
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
