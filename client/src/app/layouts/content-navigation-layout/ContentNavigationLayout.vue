<script setup lang="ts">
import { AppHeader } from 'src/shared/ui'

import { CONTENT_NAVIGATION_TITLE } from './constants'
import { IContentNavigationLayoutProps } from './types'

const props = defineProps<IContentNavigationLayoutProps>()
</script>

<template>
  <section class="content-navigation-layout">
    <div class="content-navigation-layout__scroll">
      <div v-if="props.titleKey" class="content-navigation-layout__header">
        <AppHeader :text="$t(CONTENT_NAVIGATION_TITLE[props.titleKey])" />
      </div>
      <div class="content-navigation-layout__content">
        <slot />
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.content-navigation-layout__scroll {
  overflow: auto;
  height: 100%;
  min-height: 0;
}

.content-navigation-layout__header {
  margin-bottom: 12px;
}

.content-navigation-layout__content {
  padding-right: 8px;
  padding-left: 4px;
}
</style>
