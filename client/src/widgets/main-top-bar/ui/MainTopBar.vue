<script setup lang="ts">
import { Button } from 'primevue'

import { AppIcon, AppProfileBasicData } from 'src/shared/ui'

import type { IMainTopBarProps } from './types'

defineProps<IMainTopBarProps>()

const emit = defineEmits<{
  logout: []
}>()
</script>

<template>
  <header class="main-top-bar" :style="wallpaperStyle">
    <AppProfileBasicData :image-alt="imageAlt" :image-id="imageId" :title="title">
      {{ subtitle }}
    </AppProfileBasicData>

    <div class="main-top-bar__actions">
      <Button :aria-label="logoutLabel" :loading="isLogoutLoading" rounded text @click="emit('logout')">
        <AppIcon name="exit" />
      </Button>
    </div>
  </header>
</template>

<style scoped>
.main-top-bar {
  isolation: isolate;
  position: relative;

  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-width: 0;
  padding: 8px 12px;
  border: 1px solid var(--p-app-widget-border-color, var(--p-content-border-color));
  border-radius: 18px;

  background-color: var(--p-app-widget-background, var(--p-content-background));
  background-repeat: repeat;
  background-position: 0 0;
  background-size: 320px auto;
  box-shadow: 12px 12px 28px var(--p-app-shadow-outset-start), -12px -12px 28px var(--p-app-shadow-outset-end);
}

.main-top-bar::before {
  pointer-events: none;
  content: '';

  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-50deg);

  display: var(--main-layout-wallpaper-pseudo-display, none);

  width: 240vmax;
  height: 240vmax;

  opacity: 0.3;
  background-image: var(--main-page-widget-wallpaper);
  background-repeat: repeat;
  background-position: 0 0;
  background-size: 280px auto;
}

.main-top-bar > * {
  position: relative;
  z-index: 1;
}

.main-top-bar__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.main-top-bar__actions :deep(.p-badge) {
  font-weight: 500;
}
</style>
