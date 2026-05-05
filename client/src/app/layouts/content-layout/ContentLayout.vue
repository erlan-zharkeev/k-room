<script setup lang="ts">
import { NmorphDivider, NmorphButton, NmorphScroll, NmorphIconBack } from '@nmorph/nmorph-ui-kit'
import { useRoute, useRouter } from 'vue-router'

import { useScreen } from 'src/shared/lib'
import { AppHeader } from 'src/shared/ui'

import { CONTENT_TITLE } from './constants'
import { IContentLayoutProps } from './types'

const props = defineProps<IContentLayoutProps>()

const { isTablet } = useScreen()
const route = useRoute()
const router = useRouter()

const handleBack = () => {
  router.replace({ query: { ...route.query, view: 'content-navigation' } })
}
</script>

<template>
  <section class="content-layout">
    <div class="content-layout__header">
      <div v-if="isTablet" class="content-layout__back-btn nmorph--shadow-inset">
        <NmorphButton @click="handleBack">
          <template #icon>
            <NmorphIconBack />
          </template>
        </NmorphButton>
      </div>
      <AppHeader v-if="props.titleKey" :text="$t(CONTENT_TITLE[props.titleKey])" class="content-layout__header-text" />
    </div>
    <div class="content-layout__content nmorph--shadow-inset">
      <NmorphScroll :y-gap-in-px="-6">
        <slot />
      </NmorphScroll>
    </div>
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
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.content-layout__content {
  flex: 1 1 auto;
  min-height: 0;
}

.content-layout__header-text {
  margin-left: 8px;
}

.content-layout__back-btn {
  padding: 8px;
}
</style>
