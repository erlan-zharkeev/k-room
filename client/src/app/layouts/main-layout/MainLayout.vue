<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'

import { useSettings } from 'src/entities/setting'
import { useMainMonitors } from 'src/pages/main'
import { MainLeftBar } from 'src/widgets/main-left-bar'
import { MainTopBar } from 'src/widgets/main-top-bar'

const { settings, selectedWallpaper } = useSettings()

useMainMonitors()

const wallpaperStyle = computed(() => {
  if (!settings.value.showWallpaper || !selectedWallpaper.value) return undefined

  return { '--main-layout-wallpaper': `url(${selectedWallpaper.value})` }
})
</script>

<template>
  <main
    class="main-layout"
    :class="{ 'main-layout--wallpaper': settings.showWallpaper }"
    :style="wallpaperStyle"
  >
    <MainLeftBar class="widget" />

    <section class="main-layout__workspace">
      <MainTopBar  class="widget"  />
      <RouterView />
    </section>
  </main>
</template>

<style>
.main-layout {
  position: relative;

  overflow: hidden;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 12px;

  height: 100dvh;
  padding: 12px;

  background: var(--p-app-main-bg);
}

.main-layout__workspace {
  position: relative;
  z-index: 1;

  display: grid;
  grid-template-rows: 58px minmax(0, 1fr);
  gap: 12px;

  min-width: 0;
  min-height: 0;
}

.widget {
  isolation: isolate;
  position: relative;

  overflow: hidden;

  padding: 8px;
  border-radius: 12px;
}

.widget::before {
  pointer-events: none;
  content: '';

  position: absolute;
  z-index: -1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-50deg);

  display: none;

  width: 240vmax;
  height: 240vmax;

  opacity: 0.7;
  background-image: var(--main-layout-wallpaper);
  background-repeat: repeat;
  background-size: 280px auto;
}

.main-layout--wallpaper .widget::before {
  display: block;
}

@include screen-until('tablet') {
  .main-layout {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) 62px;
  }
}
</style>
