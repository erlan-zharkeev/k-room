<script setup lang="ts">
import { RouterView } from 'vue-router'

import { useSettings } from 'src/entities/setting'
import { useMainMonitors } from 'src/pages/main'
import { MainLeftBar } from 'src/widgets/main-left-bar'
import { MainTopBar } from 'src/widgets/main-top-bar'

const { settings } = useSettings()

useMainMonitors()
</script>

<template>
  <main class="main-layout" :class="{ 'main-layout--wallpaper-hidden': !settings.showWallpaper }">
    <MainLeftBar />

    <section class="main-layout__workspace">
      <MainTopBar />
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

.main-layout--wallpaper-hidden {
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

@include screen-until('tablet') {
  .main-layout {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) 62px;
  }
}
</style>
