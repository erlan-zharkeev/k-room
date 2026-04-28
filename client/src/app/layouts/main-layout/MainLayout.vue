<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'

import { useSettings } from 'src/entities/setting'
import { useMainMonitors } from 'src/pages/main'
import { useScreen } from 'src/shared/lib'
import { MainLeftBar } from 'src/widgets/main-left-bar'
import MainMobileFooter from 'src/widgets/main-mobile-footer/ui/MainMobileFooter.vue'
import { MainTopBar } from 'src/widgets/main-top-bar'

const { isMobile } = useScreen()
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
    <MainLeftBar v-if="!isMobile" class="widget" />

    <section class="main-layout__workspace">
      <MainTopBar class="widget" />
      <div class="main-layout__content">
        <RouterView />
      </div>
      <MainMobileFooter v-if="isMobile" class="widget" />
    </section>
  </main>
</template>

<style lang="scss">
.main-layout {
  --bar-thickness: 64px;

  display: grid;
  grid-template-columns: var(--bar-thickness) minmax(0, 1fr);
  gap: 12px;
  height: 100%;

  @include screen-until('portrait-tablet') {
    grid-template-columns: minmax(0, 1fr);
  }
}

.main-layout__workspace {
  display: grid;
  grid-template-rows: var(--bar-thickness) minmax(0, 1fr);
  gap: 12px;

  @include screen-until('portrait-tablet') {
    grid-template-rows: var(--bar-thickness) minmax(0, 1fr) var(--bar-thickness);
  }
}

.main-layout__content {
  overflow: auto;
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
</style>
