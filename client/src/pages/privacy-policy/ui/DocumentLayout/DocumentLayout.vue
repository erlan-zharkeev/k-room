<script setup lang="ts">
import { ROUTE_NAMES } from 'global-shared'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useRouter } from 'vue-router'

defineProps<{
  backLabel: string
}>()

const router = useRouter()

const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.replace(ROUTE_NAMES.main)
}
</script>

<template>
  <main class="document-layout">
    <Button
      class="document-layout__back"
      icon="pi pi-arrow-left"
      :label="backLabel"
      severity="secondary"
      @click="handleBack"
    />

    <Card class="document-layout__card">
      <template #content>
        <article class="document-layout__content">
          <slot />
        </article>
      </template>
    </Card>
  </main>
</template>

<style scoped>
.document-layout {
  position: relative;

  overflow: hidden;
  display: grid;
  grid-template-rows: minmax(0, 1fr);

  box-sizing: border-box;
  height: 100dvh;
  min-height: 0;
  padding: 76px 16px 16px;
}

.document-layout__back {
  position: fixed;
  z-index: 2;
  top: 16px;
  left: 16px;

  display: inline-flex;

  width: fit-content;
  max-width: calc(100dvw - 32px);
  height: fit-content;
}

.document-layout__card {
  overflow: hidden;

  width: min(100%, 920px);
  height: 100%;
  min-height: 0;
  margin: 0 auto;
  border: 1px solid var(--dark-gray-transparent-2);
  border-radius: 8px;

  background: var(--surface-card);
  box-shadow: 16px 16px 36px var(--shadow-outset-start), -16px -16px 36px var(--shadow-outset-end);
}

.document-layout__card :deep(.p-card-body),
.document-layout__card :deep(.p-card-content) {
  box-sizing: border-box;
  height: 100%;
  min-height: 0;
}

.document-layout__card :deep(.p-card-body) {
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  padding: 0;
}

.document-layout__card :deep(.p-card-content) {
  overflow: auto;
  padding: 20px;
}

.document-layout__content {
  color: var(--semi-contrast-text);
  overflow-wrap: anywhere;
}

.document-layout__content :deep(h1),
.document-layout__content :deep(h2),
.document-layout__content :deep(p),
.document-layout__content :deep(ul) {
  margin-top: 0;
}

.document-layout__content :deep(h1) {
  margin-bottom: 14px;
  font-size: 1.6rem;
  line-height: 1.2;
  color: var(--contrast-text);
}

.document-layout__content :deep(h2) {
  margin-bottom: 10px;
  font-size: 1.05rem;
  line-height: 1.3;
  color: var(--contrast-text);
}

.document-layout__content :deep(p),
.document-layout__content :deep(li) {
  font-size: 0.96rem;
  line-height: 1.65;
}

.document-layout__content :deep(section) {
  margin-top: 24px;
}

.document-layout__content :deep(ul) {
  display: grid;
  gap: 8px;
  padding-left: 22px;
}

.document-layout__content :deep(strong) {
  color: var(--contrast-text);
}

@media (width <= 640px) {
  .document-layout {
    padding: 72px 10px 10px;
  }

  .document-layout__back {
    top: 10px;
    left: 10px;
  }
}
</style>
