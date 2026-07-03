<script setup lang="ts">
import { NmorphText, NmorphCard } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'
import { RouterLink, RouterView, useRoute } from 'vue-router'

import { SelectLanguage } from 'src/features/select-language'
import { SelectTheme } from 'src/features/select-theme'
import { AppLogo } from 'src/shared/ui'

import { AUTH_LAYOUT_TABS } from './constants'
import type { AuthLayoutProps } from './types'

const props = defineProps<AuthLayoutProps>()
const route = useRoute()
</script>

<template>
  <section class="auth-layout">
    <div class="auth-layout__top-side">
      <NmorphCard
        class="auth-layout__logo-card"
        content-class="auth-layout__logo-card-content"
        :card-padding="8"
        :fill="false"
        shadow-type="inset"
      >
        <AppLogo />
      </NmorphCard>
      <div class="auth-layout__controls">
        <SelectLanguage compact class="auth-layout__language" />
        <SelectTheme compact />
      </div>
    </div>
    <div class="auth-layout__card">
      <NmorphCard :card-padding="24" shadow-type="inset">
        <div class="auth-layout__tabs">
          <div
            :class="[
              'auth-layout__tabs-indicator',
              { 'auth-layout__tabs-indicator--registration': route.path === ROUTE_NAMES.authRegistration }
            ]"
          />
          <RouterLink
            v-for="tab in AUTH_LAYOUT_TABS"
            :key="tab.path"
            :aria-disabled="props.blockNavigation"
            :class="[
              'auth-layout__tab',
              { 'auth-layout__tab--active': route.path === tab.path },
              { 'auth-layout__tab--disabled': props.blockNavigation }
            ]"
            :tabindex="props.blockNavigation ? -1 : undefined"
            :to="tab.path"
            @click.prevent="props.blockNavigation"
          >
            <NmorphText
              as="h4"
              :color="route.path === tab.path ? 'accent' : 'text'"
              variant="title-small"
              weight="bold"
              >{{ $t(tab.label) }}</NmorphText
            >
          </RouterLink>
        </div>
        <RouterView v-slot="{ Component, route }">
          <Transition name="app-route-motion" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </Transition>
        </RouterView>
      </NmorphCard>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.auth-layout {
  isolation: isolate;
  position: relative;

  overflow: hidden;
  display: grid;
  place-items: center;
}

.auth-layout__top-side {
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  width: 100%;
}

.auth-layout__card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: var(--app-card-basic-width);
}

.auth-layout__logo-card {
  width: fit-content;
}

.auth-layout__logo-card :deep(.auth-layout__logo-card-content) {
  display: flex;
}

.auth-layout__tabs {
  position: relative;
  display: flex;
  align-items: stretch;
  margin-bottom: 16px;
}

.auth-layout__tabs::after {
  content: '';

  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;

  height: 2px;

  background: var(--nmorph-text-color);
}

.auth-layout__tabs-indicator {
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 0;

  width: 50%;
  height: 2px;

  background: var(--nmorph-accent-color);
}

.auth-layout__tabs-indicator--registration {
  transform: translateX(100%);
}

.auth-layout__tab {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;

  min-width: 0;
  padding-bottom: 12px;

  text-decoration: none;
}

.auth-layout__tab--active {
  pointer-events: none;
}

.auth-layout__tab--disabled {
  @include disabled-state;
}

.auth-layout__language {
  margin-bottom: 12px;
}

.auth-layout__controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>
