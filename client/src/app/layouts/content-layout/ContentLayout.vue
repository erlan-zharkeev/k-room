<script setup lang="ts">
import { NmorphButton, NmorphCard, NmorphIconBack, NmorphScroll } from '@nmorph/nmorph-ui-kit'
import { useRoute, useRouter } from 'vue-router'

import { useScreen } from 'src/shared/lib'
import { AppHeader } from 'src/shared/ui'

import { CONTENT_TITLE } from './constants'
import { IContentLayoutProps } from './types'

const props = withDefaults(defineProps<IContentLayoutProps>(), {
  scrollable: true
})

const { isPortraitTabletOrLess } = useScreen()
const route = useRoute()
const router = useRouter()

const handleBack = () => {
  router.replace({ query: { ...route.query, view: 'content-navigation' } })
}
</script>

<template>
  <section class="content-layout">
    <div class="content-layout__header">
      <NmorphCard shadow-type="inset" :fill="false" v-if="isPortraitTabletOrLess" class="content-layout__back-btn">
        <NmorphButton @click="handleBack">
          <template #icon>
            <NmorphIconBack />
          </template>
        </NmorphButton>
      </NmorphCard>
      <div class="content-layout__header-body">
        <slot name="header">
          <AppHeader v-if="props.titleKey" :text="$t(CONTENT_TITLE[props.titleKey])" />
        </slot>
      </div>
    </div>
    <NmorphCard shadow-type="inset" class="content-layout__content">
      <NmorphScroll v-if="props.scrollable">
        <slot />
      </NmorphScroll>
      <slot v-else />
    </NmorphCard>
    <div v-if="$slots.footer" class="content-layout__footer">
      <slot name="footer" />
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
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.content-layout__content {
  flex: 1 1 auto;
  min-height: 0;
}

.content-layout__back-btn {
  padding: 8px;
}
</style>
