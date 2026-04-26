<script setup lang="ts">
import { ROUTE_NAMES } from 'global-shared'
import { Button, Card } from 'primevue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { AppIcon } from 'src/shared/ui'

import type { IPageLayoutProps } from './types'

const props = withDefaults(defineProps<IPageLayoutProps>(), {
  cardSize: 'small',
  fallbackRoute: ROUTE_NAMES.main,
  title: '',
  variant: 'centered'
})

const router = useRouter()
const pageLayoutClasses = computed(() => [
  'page-layout',
  `page-layout--${props.variant}`,
  `page-layout--${props.cardSize}`
])

const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.replace(props.fallbackRoute)
}
</script>

<template>
  <main :class="pageLayoutClasses">
    <Button class="page-layout__back" :label="backLabel" severity="secondary" @click="handleBack">
      <template #icon>
        <AppIcon name="arrow-left" />
      </template>
    </Button>

    <Card class="page-layout__card">
      <template v-if="title" #title>{{ title }}</template>
      <template #content>
        <article class="page-layout__content">
          <slot />
        </article>
      </template>
    </Card>
  </main>
</template>

<style scoped>
.page-layout {
  position: relative;
  box-sizing: border-box;
  min-height: 100dvh;
  padding: 76px 16px 16px;
}

.page-layout--document {
  overflow: hidden;
  display: grid;
  grid-template-rows: minmax(0, 1fr);

  height: 100dvh;
  min-height: 0;
}

.page-layout--centered {
  display: grid;
  place-items: center;
}

.page-layout__back {
  position: fixed;
  z-index: 2;
  top: 16px;
  left: 16px;

  display: inline-flex;

  width: fit-content;
  max-width: calc(100dvw - 32px);
  height: fit-content;
}

.page-layout__card {
  width: min(100%, var(--page-layout-card-width));
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  background: var(--p-content-background);
  box-shadow: 16px 16px 36px var(--p-app-shadow-outset-start), -16px -16px 36px var(--p-app-shadow-outset-end);
}

.page-layout--small {
  --page-layout-card-width: 420px;
}

.page-layout--medium {
  --page-layout-card-width: 480px;
}

.page-layout--large {
  --page-layout-card-width: 920px;
}

.page-layout--document .page-layout__card {
  overflow: hidden;
  height: 100%;
  min-height: 0;
  margin: 0 auto;
}

.page-layout--document .page-layout__card :deep(.p-card-body),
.page-layout--document .page-layout__card :deep(.p-card-content) {
  box-sizing: border-box;
  height: 100%;
  min-height: 0;
}

.page-layout--document .page-layout__card :deep(.p-card-body) {
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  padding: 0;
}

.page-layout--document .page-layout__card :deep(.p-card-content) {
  overflow: auto;
  padding: 20px;
}

.page-layout--centered .page-layout__card :deep(.p-card-title) {
  margin-bottom: 14px;
}

.page-layout__content {
  color: var(--p-app-text-semi-contrast);
  overflow-wrap: anywhere;
}

.page-layout--document .page-layout__content :deep(h1),
.page-layout--document .page-layout__content :deep(h2),
.page-layout--document .page-layout__content :deep(p),
.page-layout--document .page-layout__content :deep(ul) {
  margin-top: 0;
}

.page-layout--document .page-layout__content :deep(h1) {
  margin-bottom: 14px;
  font-size: 1.6rem;
  line-height: 1.2;
  color: var(--p-app-text-contrast);
}

.page-layout--document .page-layout__content :deep(h2) {
  margin-bottom: 10px;
  font-size: 1.05rem;
  line-height: 1.3;
  color: var(--p-app-text-contrast);
}

.page-layout--document .page-layout__content :deep(p),
.page-layout--document .page-layout__content :deep(li) {
  font-size: 0.96rem;
  line-height: 1.65;
}

.page-layout--document .page-layout__content :deep(section) {
  margin-top: 24px;
}

.page-layout--document .page-layout__content :deep(ul) {
  display: grid;
  gap: 8px;
  padding-left: 22px;
}

.page-layout__content :deep(strong) {
  color: var(--p-app-text-contrast);
}

@media (width <= 640px) {
  .page-layout {
    padding: 72px 10px 10px;
  }

  .page-layout__back {
    top: 10px;
    left: 10px;
  }
}
</style>
