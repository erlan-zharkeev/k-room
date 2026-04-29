<script setup lang="ts">
import { Button } from 'primevue'
import { useRoute, useRouter } from 'vue-router'

import { useScreen } from 'src/shared/lib'
import { AppHeader } from 'src/shared/ui'

import { CONTENT_TITLE } from './constants'
import { IContentLayoutProps } from './types'

const props = defineProps<IContentLayoutProps>()

const { isMobile } = useScreen()
const route = useRoute()
const router = useRouter()

const handleBack = () => {
  router.replace({ query: { ...route.query, view: 'content-navigation' } })
}
</script>

<template>
  <section class="content-layout">
    <div class="content-layout__header">
      <Button
        v-if="isMobile"
        icon="pi pi-angle-left"
        size="small"
        severity="secondary"
        text
        @click="handleBack"
      />
      <AppHeader v-if="props.titleKey" :text="$t(CONTENT_TITLE[props.titleKey])" />
    </div>
    <slot />
  </section>
</template>

<style lang="scss">
.content-layout__header {
  display: flex;
  gap: 4px;
  align-items: center;
}
</style>
