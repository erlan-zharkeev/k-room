<script setup lang="ts">
import { Card, Tab, TabList, Tabs } from 'primevue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

import { LanguageSelect } from 'src/features/language-select'
import { ThemeSelect } from 'src/features/theme-select'
import { AppLogo } from 'src/shared/ui'

import { AUTH_LAYOUT_TABS } from './constants'
import { IAuthLayoutProps } from './types'

const props = defineProps<IAuthLayoutProps>()
const route = useRoute()
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

    <Card class="auth-layout__card">
      <template #content>
        <Tabs class="auth-layout__tabs" :value="route.path">
          <TabList>
            <template v-for="tab in AUTH_LAYOUT_TABS" :key="tab.path">
              <RouterLink v-if="!props.blockNavigation" class="auth-layout__tab-link" :to="tab.path">
                <Tab as="div" :value="tab.path" :pt="{ root: { class: 'auth-layout__tab auth-layout__tab--linked' } }">
                  {{ $t(tab.label) }}
                </Tab>
              </RouterLink>
              <Tab v-else disabled :value="tab.path">
                {{ $t(tab.label) }}
              </Tab>
            </template>
          </TabList>
        </Tabs>
        <RouterView />
      </template>
    </Card>
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
  align-items: center;
  justify-content: space-between;

  width: 100%;
}

.auth-layout__card {
  width: min(100%, 420px);
}

.auth-layout__tabs {
  margin-bottom: 16px;
}

.auth-layout__tab--linked {
  display: flex;
  justify-content: center;
}

.auth-layout__tab-link {
  width: 50%;
}

.auth-layout__language {
  margin-bottom: 8px;
}
</style>
