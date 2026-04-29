<script setup lang="ts">
import { AppHeader } from 'src/shared/ui'

import { CONTENT_NAVIGATION_TITLE } from './constants'
import { IContentNavigationLayoutProps } from './types'

const props = defineProps<IContentNavigationLayoutProps>()
</script>

<template>
  <section class="content-navigation-layout">
    <AppHeader v-if="props.titleKey" :text="$t(CONTENT_NAVIGATION_TITLE[props.titleKey])" />
    <slot />
  </section>
</template>
