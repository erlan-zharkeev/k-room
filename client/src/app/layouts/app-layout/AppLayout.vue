<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'
import { RouterView } from 'vue-router'

import { useAppMonitors } from 'src/pages/app'
import { useScreen } from 'src/shared/lib'
import { LeftBar } from 'src/widgets/left-bar'
import { MobileFooter } from 'src/widgets/mobile-footer'
import { TopBar } from 'src/widgets/top-bar'

import ContentLayout from './../content-layout/ContentLayout.vue'
import ContentNavigationLayout from './../content-navigation-layout/ContentNavigationLayout.vue'
import { CONTENT_FOOTER_ROUTER_VIEW_NAME, CONTENT_HEADER_ROUTER_VIEW_NAME } from './constants'
import { useAppLayout } from './use-app-layout.model'

useAppMonitors()
const { isPortraitTabletOrLess } = useScreen()
const {
  showWallpaper,
  wallpaperStyle,
  showNavigation,
  showContent,
  contentTitleKey,
  navigationTitleKey,
  isContentScrollable,
  hasContentFooter,
  hasContentHeader
} = useAppLayout()
</script>

<template>
  <main class="app-layout" :class="{ 'app-layout--wallpaper': showWallpaper }" :style="wallpaperStyle">
    <LeftBar v-if="!isPortraitTabletOrLess" class="widget" />
    <section class="app-layout__workspace">
      <TopBar class="widget" />
      <div class="app-layout__content">
        <NmorphCard v-if="showNavigation" class="app-layout__navigation-widget widget">
          <ContentNavigationLayout :title-key="navigationTitleKey">
            <RouterView name="content-navigation" />
          </ContentNavigationLayout>
        </NmorphCard>
        <NmorphCard v-if="showContent" class="app-layout__content-widget widget">
          <ContentLayout :title-key="contentTitleKey" :scrollable="isContentScrollable">
            <template v-if="hasContentHeader" #header>
              <RouterView :name="CONTENT_HEADER_ROUTER_VIEW_NAME" />
            </template>
            <RouterView name="content" />
            <template v-if="hasContentFooter" #footer>
              <RouterView :name="CONTENT_FOOTER_ROUTER_VIEW_NAME" />
            </template>
          </ContentLayout>
        </NmorphCard>
      </div>
      <MobileFooter v-if="isPortraitTabletOrLess" class="widget" />
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
