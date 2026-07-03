<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'
import { RouterView } from 'vue-router'

import { AppWelcomeDialog } from 'src/features/app-welcome'
import { OnboardingGuide, OnboardingGuideTarget, useOnboardingGuide } from 'src/features/onboarding-guide'
import { RoomCallAudioOutput } from 'src/features/room-call-session'
import { useAppMonitors } from 'src/pages/app'
import { useScreen } from 'src/shared/lib'
import { LeftBar } from 'src/widgets/left-bar'
import { MobileNavFooter } from 'src/widgets/mobile-nav-footer'
import { TopBar } from 'src/widgets/top-bar'

import ContentLayout from './../content-layout/ContentLayout.vue'
import ContentNavigationLayout from './../content-navigation-layout/ContentNavigationLayout.vue'
import { useAppLayout } from './use-app-layout.model'

useAppMonitors()
const { isPortraitTabletOrLess } = useScreen()
const { openPendingGuide } = useOnboardingGuide()
const {
  showWallpaper,
  wallpaperStyle,
  showNavigation,
  showContent,
  contentTitleKey,
  navigationTitleKey,
  isContentLayoutEnabled
} = useAppLayout()
</script>

<template>
  <div class="app-layout-root">
    <RoomCallAudioOutput />
    <AppWelcomeDialog @complete="openPendingGuide" />
    <OnboardingGuide>
      <main class="app-layout" :class="{ 'app-layout--wallpaper': showWallpaper }" :style="wallpaperStyle">
        <LeftBar v-if="!isPortraitTabletOrLess" class="widget" />
        <section class="app-layout__workspace">
          <TopBar class="widget" />
          <div class="app-layout__content">
            <OnboardingGuideTarget v-if="showNavigation" class="app-layout__guide-target" name="contentNavigation">
              <NmorphCard class="app-layout__navigation-widget widget">
                <ContentNavigationLayout :title-key="navigationTitleKey">
                  <RouterView v-slot="{ Component, route }" name="content-navigation">
                    <Transition name="app-route-motion" mode="out-in">
                      <component :is="Component" :key="route.matched[1]?.path ?? route.fullPath" />
                    </Transition>
                  </RouterView>
                </ContentNavigationLayout>
              </NmorphCard>
            </OnboardingGuideTarget>
            <OnboardingGuideTarget v-if="showContent" class="app-layout__guide-target" name="content">
              <NmorphCard class="app-layout__content-widget widget">
                <ContentLayout v-if="isContentLayoutEnabled" :title-key="contentTitleKey">
                  <RouterView v-slot="{ Component, route }" name="content">
                    <component :is="Component" :key="route.matched[1]?.path ?? route.fullPath" />
                  </RouterView>
                </ContentLayout>
                <RouterView v-else v-slot="{ Component, route }" name="content">
                  <component :is="Component" :key="route.matched[1]?.path ?? route.fullPath" />
                </RouterView>
              </NmorphCard>
            </OnboardingGuideTarget>
          </div>
          <MobileNavFooter v-if="isPortraitTabletOrLess" class="widget" />
        </section>
      </main>
    </OnboardingGuide>
  </div>
</template>

<style lang="scss" scoped>
.app-layout-root {
  height: 100%;
  min-height: 0;
}

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
  grid-template-columns: 1.2fr 2.5fr;
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

.app-layout__guide-target .widget {
  flex: 1 1 auto;
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
  transform: var(--app-layout-wallpaper-transform);

  display: none;

  width: 240vmax;
  height: 240vmax;

  opacity: 0.7;
  background-image: var(--app-layout-wallpaper);
  background-size: 280px auto;
  filter: var(--app-layout-wallpaper-brightness);
}

.app-layout--wallpaper .widget::before {
  display: block;
}
</style>

<style lang="scss" scoped>
.app-layout__guide-target.nmorph-guide-step,
.app-layout__guide-target.nmorph-tooltip {
  display: flex;
  min-width: 0;
  min-height: 0;
}

.app-layout__guide-target > :deep(.nmorph-tooltip),
.app-layout__guide-target > :deep(.nmorph-tooltip__content),
.app-layout__guide-target > :deep(.nmorph-tooltip__content > .nmorph-tooltip__trigger),
.app-layout__guide-target > :deep(.nmorph-tooltip > .nmorph-tooltip__content),
.app-layout__guide-target > :deep(.nmorph-tooltip > .nmorph-tooltip__content > .nmorph-tooltip__trigger) {
  display: flex;
  flex: 1 1 auto;
  align-items: stretch;

  min-width: 0;
  min-height: 0;
}

.app-layout__guide-target.nmorph-guide-step > :deep(.nmorph-tooltip__content > .nmorph-tooltip__trigger)::after,
.app-layout__guide-target.nmorph-guide-step
  > :deep(.nmorph-tooltip > .nmorph-tooltip__content > .nmorph-tooltip__trigger)::after {
  inset: 0;
}
</style>
