<script setup lang="ts">
import { isString } from 'lodash'
import { computed, watch } from 'vue'
import { RouterView, useRoute, useRouter, type LocationQueryValue } from 'vue-router'

import { useSettings } from 'src/entities/setting'
import { useMainMonitors } from 'src/pages/main'
import { useScreen } from 'src/shared/lib'
import { MainLeftBar } from 'src/widgets/main-left-bar'
import { MainMobileFooter } from 'src/widgets/main-mobile-footer'
import { MainTopBar } from 'src/widgets/main-top-bar'

import ContentLayout from './../content-layout/ContentLayout.vue'
import { isContentTitleKey } from './../content-layout/types'
import ContentNavigationLayout from './../content-navigation-layout/ContentNavigationLayout.vue'
import { isContentNavigationTitleKey } from './../content-navigation-layout/types'

const { isMobile } = useScreen()
const { effectiveTheme, settings } = useSettings()
const route = useRoute()
const router = useRouter()

useMainMonitors()

const isSupportedMobileMainLayoutView = (view: LocationQueryValue | LocationQueryValue[] | undefined) =>
  isString(view) && ['content', 'content-navigation'].includes(view)

watch(
  isMobile,
  (mobile) => {
    if (mobile) {
      if (isSupportedMobileMainLayoutView(route.query.view)) return

      router.replace({ query: { ...route.query, view: 'content-navigation' } })
      return
    }

    if (!('view' in route.query)) return

    const { view: _, ...rest } = route.query

    router.replace({ query: rest })
  },
  { immediate: true }
)

const showNavigation = computed(() => !isMobile.value || route.query.view === 'content-navigation')
const showContent = computed(() => !isMobile.value || route.query.view !== 'content-navigation')

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
    '--main-layout-wallpaper': `url(${effectiveTheme.value.wallpaper.url})`,
    '--main-layout-wallpaper-transform': `translate(-50%, -50%)rotate(${
      effectiveTheme.value.wallpaper.angle
    }deg) scale(${effectiveTheme.value.wallpaper.scale / 100})`,
    '--main-layout-wallpaper-brightness': `brightness(${100 - effectiveTheme.value.wallpaper.darkness}%)`
  }
})
</script>

<template>
  <main
    class="main-layout"
    :class="{ 'main-layout--wallpaper': settings.appearance.showWallpaper }"
    :style="wallpaperStyle"
  >
    <MainLeftBar v-if="!isMobile" class="widget" />
    <section class="main-layout__workspace">
      <MainTopBar class="widget" />
      <div class="main-layout__content">
        <div v-if="showNavigation" class="main-layout__navigation-widget widget">
          <ContentNavigationLayout :title-key="navigationTitleKey">
            <RouterView name="content-navigation" />
          </ContentNavigationLayout>
        </div>
        <div v-if="showContent" class="main-layout__content-widget widget">
          <ContentLayout :title-key="contentTitleKey">
            <RouterView name="content" />
          </ContentLayout>
        </div>
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
  min-height: 0;

  @include screen-mobile {
    grid-template-columns: minmax(0, 1fr);
  }
}

.main-layout__workspace {
  display: grid;
  grid-template-rows: var(--bar-thickness) minmax(0, 1fr);
  gap: 12px;
  min-height: 0;

  @include screen-mobile {
    grid-template-rows: var(--bar-thickness) minmax(0, 1fr) var(--bar-thickness);
  }
}

.main-layout__content {
  overflow: auto;
  display: grid;
  grid-template-columns: 1fr 2.5fr;
  gap: 12px;

  min-width: 0;
  min-height: 0;

  @include screen-mobile {
    grid-template-columns: 1fr;
  }
}

.main-layout__navigation-widget,
.main-layout__content-widget {
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
  transform-origin: center;
  transform: var(--main-layout-wallpaper-transform, translate(-50%, -50%));

  display: none;

  width: var(--main-layout-wallpaper-width, 240vmax);
  height: var(--main-layout-wallpaper-height, 240vmax);

  opacity: 0.7;
  background-image: var(--main-layout-wallpaper);
  background-size: var(--main-layout-wallpaper-size, 280px auto);
  filter: var(--main-layout-wallpaper-brightness, brightness(100%));
}

.main-layout--wallpaper .widget::before {
  display: block;
}
</style>
