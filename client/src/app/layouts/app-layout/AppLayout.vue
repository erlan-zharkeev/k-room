<script setup lang="ts">
import { isString } from 'lodash'
import { computed, watch } from 'vue'
import { RouterView, useRoute, useRouter, type LocationQueryValue } from 'vue-router'

import { useSettings } from 'src/entities/setting'
import { useAppMonitors } from 'src/pages/app'
import { useScreen } from 'src/shared/lib'
import { LeftBar } from 'src/widgets/left-bar'
import { MobileFooter } from 'src/widgets/mobile-footer'
import { TopBar } from 'src/widgets/top-bar'

import ContentLayout from './../content-layout/ContentLayout.vue'
import { isContentTitleKey } from './../content-layout/types'
import ContentNavigationLayout from './../content-navigation-layout/ContentNavigationLayout.vue'
import { isContentNavigationTitleKey } from './../content-navigation-layout/types'

const { isPortraitTabletOrLess } = useScreen()
const { effectiveTheme, settings } = useSettings()
const route = useRoute()
const router = useRouter()

useAppMonitors()

const isSupportedTabletAppLayoutView = (view: LocationQueryValue | LocationQueryValue[] | undefined) =>
  isString(view) && ['content', 'content-navigation'].includes(view)

watch(
  isPortraitTabletOrLess,
  (tablet) => {
    if (tablet) {
      if (isSupportedTabletAppLayoutView(route.query.view)) return

      router.replace({ query: { ...route.query, view: 'content-navigation' } })
      return
    }

    if (!('view' in route.query)) return

    const { view: _, ...rest } = route.query

    router.replace({ query: rest })
  },
  { immediate: true }
)

const showNavigation = computed(() => !isPortraitTabletOrLess.value || route.query.view === 'content-navigation')
const showContent = computed(() => !isPortraitTabletOrLess.value || route.query.view !== 'content-navigation')
const showWallpaper = computed(
  () => settings.value.appearance.showWallpaper && Boolean(effectiveTheme.value.wallpaper.url)
)

const segments = computed(() => route.path.split('/').filter(Boolean))

const navigationTitleKey = computed(() => {
  const titleKey = segments.value[1]
  return isContentNavigationTitleKey(titleKey) ? titleKey : undefined
})

const contentTitleKey = computed(() => {
  const titleKey = segments.value[2]
  return isContentTitleKey(titleKey) ? titleKey : undefined
})

const wallpaperStyle = computed(() => {
  return {
    '--app-layout-wallpaper': `url(${effectiveTheme.value.wallpaper.url})`,
    '--app-layout-wallpaper-transform': `translate(-50%, -50%)rotate(${
      effectiveTheme.value.wallpaper.angle
    }deg) scale(${effectiveTheme.value.wallpaper.scale / 100})`,
    '--app-layout-wallpaper-brightness': `brightness(${100 - effectiveTheme.value.wallpaper.darkness}%)`
  }
})
</script>

<template>
  <main class="app-layout" :class="{ 'app-layout--wallpaper': showWallpaper }" :style="wallpaperStyle">
    <LeftBar v-if="!isPortraitTabletOrLess" class="widget nmorph--shadow-outset" />
    <section class="app-layout__workspace">
      <TopBar class="widget nmorph--shadow-outset" />
      <div class="app-layout__content">
        <div v-if="showNavigation" class="app-layout__navigation-widget widget nmorph--shadow-outset">
          <ContentNavigationLayout :title-key="navigationTitleKey">
            <RouterView name="content-navigation" />
          </ContentNavigationLayout>
        </div>
        <div v-if="showContent" class="app-layout__content-widget widget nmorph--shadow-outset">
          <ContentLayout :title-key="contentTitleKey">
            <RouterView name="content" />
          </ContentLayout>
        </div>
      </div>
      <MobileFooter v-if="isPortraitTabletOrLess" class="widget nmorph--shadow-outset" />
    </section>
  </main>
</template>

<style lang="scss">
.app-layout {
  --bar-thickness: 64px;

  display: grid;
  grid-template-columns: var(--bar-thickness) minmax(0, 1fr);
  gap: 12px;

  height: 100%;
  min-height: 0;

  @include screen-tablet {
    grid-template-columns: minmax(0, 1fr);
  }
}

.app-layout__workspace {
  display: grid;
  grid-template-rows: var(--bar-thickness) minmax(0, 1fr);
  gap: 12px;
  min-height: 0;

  @include screen-tablet {
    grid-template-rows: var(--bar-thickness) minmax(0, 1fr) var(--bar-thickness);
  }
}

.app-layout__content {
  display: grid;
  grid-template-columns: 1fr 2.5fr;
  gap: 12px;

  min-width: 0;
  min-height: 0;

  @include screen-tablet {
    grid-template-columns: 1fr;
  }
}

.app-layout__navigation-widget,
.app-layout__content-widget {
  min-width: 0;
  min-height: 0;
}

.widget {
  isolation: isolate;
  position: relative;
  overflow: hidden;
  padding: 8px;
}

.widget::before {
  pointer-events: none;
  content: '';

  position: absolute;
  z-index: -1;
  top: 50%;
  left: 50%;
  transform-origin: center;
  transform: var(--app-layout-wallpaper-transform, translate(-50%, -50%));

  display: none;

  width: var(--app-layout-wallpaper-width, 240vmax);
  height: var(--app-layout-wallpaper-height, 240vmax);

  opacity: 0.7;
  background-image: var(--app-layout-wallpaper);
  background-size: var(--app-layout-wallpaper-size, 280px auto);
  filter: var(--app-layout-wallpaper-brightness, brightness(100%));
}

.app-layout--wallpaper .widget::before {
  display: block;
}
</style>
