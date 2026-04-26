<script setup lang="ts">
import { Badge, Button } from 'primevue'
import { RouterLink, useRoute } from 'vue-router'

import { AppIcon, AppLogo } from 'src/shared/ui'

import type { IMainLeftBarProps } from './types'

const props = defineProps<IMainLeftBarProps>()

const route = useRoute()

const getSettingsPath = (settingsId: string) => `${props.settingsRoutePrefix}/${settingsId}`
</script>

<template>
  <aside class="main-left-bar" :style="wallpaperStyle">
    <AppLogo class="main-left-bar__brand" />

    <nav class="main-left-bar__nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.id === 'settings' ? getSettingsPath(selectedSettingsId) : item.path"
        custom
        v-slot="{ href, navigate, isExactActive }"
      >
        <Button
          :href="href"
          :aria-label="$t(item.label)"
          :aria-current="isExactActive ? 'page' : undefined"
          :class="{
            'main-left-bar__nav-button--active':
              isExactActive || (item.id === 'settings' && route.path.startsWith(settingsRoutePrefix))
          }"
          as="a"
          size="small"
          text
          @click="navigate"
        >
          <AppIcon :name="item.icon" />
          <Badge v-if="item.id === 'infoNotifications' && unreadInfoNotifications" :value="unreadInfoNotifications" />
          <Badge v-if="item.id === 'chatRooms' && unreadMessages" :value="unreadMessages" />
        </Button>
      </RouterLink>
    </nav>
  </aside>
</template>

<style>
.main-left-bar {
  isolation: isolate;
  position: relative;

  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  min-width: 0;
  padding: 10px 8px;
  border: 1px solid var(--p-app-widget-border-color, var(--p-content-border-color));
  border-radius: 18px;

  background-color: var(--p-app-widget-background, var(--p-content-background));
  background-repeat: repeat;
  background-position: 0 0;
  background-size: 320px auto;
  box-shadow: 12px 12px 28px var(--p-app-shadow-outset-start), -12px -12px 28px var(--p-app-shadow-outset-end);
}

.main-left-bar::before {
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

.main-left-bar > * {
  position: relative;
  z-index: 1;
}

.main-left-bar__brand {
  width: 38px;
  height: 38px;
  padding: 6px;
  border-radius: 12px;

  background: var(--p-app-widget-background, var(--p-content-background));
}

.main-left-bar__nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  margin-block: auto;
}

.main-left-bar__nav :deep(.p-button) {
  position: relative;

  display: grid;
  place-items: center;

  width: 42px;
  height: 42px;
  padding: 0;
  border-radius: 8px;
}

.main-left-bar__nav :deep(.app-icon) {
  position: relative;
  z-index: 1;
}

.main-left-bar__nav :deep(.p-badge) {
  position: absolute;
  z-index: 2;
  top: 4px;
  right: 4px;

  min-width: 16px;
  height: 16px;
  padding: 0 4px;

  font-size: 0.7rem;
  font-weight: 500;
  line-height: 16px;
}

.main-left-bar__nav-button--active {
  color: var(--p-primary-contrast-color);
  background: var(--p-primary-color);
}

@media (width <= 820px) {
  .main-left-bar {
    grid-row: 2;
    flex-direction: row;
    justify-content: space-between;
    padding: 8px 10px;
  }

  .main-left-bar__nav {
    flex-direction: row;
    margin-block: 0;
  }
}
</style>
