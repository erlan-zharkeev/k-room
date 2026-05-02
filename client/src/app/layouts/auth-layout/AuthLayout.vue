<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'
import { RouterLink, RouterView, useRoute } from 'vue-router'

import { LanguageSelect } from 'src/features/language-select'
import { ThemeSelect } from 'src/features/theme-select'
import { createClassNameWithModifiers } from 'src/shared/lib'
import { AppLogo, AppText } from 'src/shared/ui'

import { AUTH_LAYOUT_TABS } from './constants'
import type { IAuthLayoutProps } from './types'

const props = defineProps<IAuthLayoutProps>()
const route = useRoute()

const getTabClassName = (path: string) =>
  createClassNameWithModifiers({
    rootClass: 'auth-layout__tab',
    modifiers: [route.path === path && 'active', props.blockNavigation && 'disabled']
  })

const blockTabNavigation = (event: MouseEvent) => {
  if (!props.blockNavigation) return

  event.preventDefault()
}
</script>

<template>
  <section class="auth-layout">
    <div class="auth-layout__top-side">
      <AppLogo class="auth-layout__logo" />
      <div class="auth-layout__controls">
        <LanguageSelect compact class="auth-layout__language" />
        <ThemeSelect compact />
      </div>
    </div>
    <div class="auth-layout__card">
      <NmorphCard>
        <div class="auth-layout__tabs">
          <RouterLink
            v-for="tab in AUTH_LAYOUT_TABS"
            :key="tab.path"
            :aria-disabled="props.blockNavigation"
            :class="getTabClassName(tab.path)"
            :tabindex="props.blockNavigation ? -1 : undefined"
            :to="tab.path"
            @click="blockTabNavigation"
          >
            <AppText
              :color="route.path === tab.path ? 'accent-color' : 'contrast-color'"
              :text="$t(tab.label)"
            />
          </RouterLink>
        </div>
        <RouterView />
      </NmorphCard>
    </div>

  </section>
</template>

<style>
.auth-layout {
  display: grid;
  place-items: center;
}

.auth-layout__top-side {
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  width: 100%;
}

.auth-layout__card {
  width: 100%;
  max-width: 420px;
}

.auth-layout__tabs {
  display: flex;
  align-items: stretch;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--p-text-muted-color);
}

.auth-layout__tab {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;

  margin-bottom: -1px;
  padding-bottom: 12px;
  border-bottom: 2px solid transparent;

  text-decoration: none;
}

.auth-layout__tab--active {
  border-bottom-color: var(--p-primary-color);
}

.auth-layout__tab--disabled {
  cursor: default;
}

.auth-layout__language {
  margin-bottom: 8px;
}

.auth-layout__controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>
