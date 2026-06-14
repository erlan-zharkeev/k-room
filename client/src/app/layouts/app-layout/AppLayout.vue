<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'
import { RouterView } from 'vue-router'

import { AppWelcomeDialog } from 'src/features/app-welcome'
import {
  ONBOARDING_GUIDE_STEP,
  OnboardingGuide,
  OnboardingGuideTarget,
  useOnboardingGuide
} from 'src/features/onboarding-guide'
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
  <AppWelcomeDialog @complete="openPendingGuide" />
  <OnboardingGuide>
    <main class="app-layout" :class="{ 'app-layout--wallpaper': showWallpaper }" :style="wallpaperStyle">
      <LeftBar v-if="!isPortraitTabletOrLess" class="widget" />
      <section class="app-layout__workspace">
        <TopBar class="widget" />
        <div class="app-layout__content">
          <OnboardingGuideTarget
            v-if="showNavigation"
            class="app-layout__guide-target"
            :name="ONBOARDING_GUIDE_STEP.contentNavigation"
          >
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
          <OnboardingGuideTarget
            v-if="showContent"
            class="app-layout__guide-target"
            :name="ONBOARDING_GUIDE_STEP.content"
          >
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

.app-layout__guide-target.onboarding-guide-target--active .widget::after {
  pointer-events: none;
  content: '';

  position: absolute;
  z-index: 2;
  inset: 0;

  border: 2px solid var(--app-guide-target-border-color);
  border-radius: 8px;

  box-shadow: var(--app-guide-target-shadow);
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
