<script setup lang="ts">
import { ROUTE_NAMES } from 'global-shared'
import { Card, Tab, TabList, Tabs } from 'primevue'
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { CLIENT_ENV } from 'src/shared/config'

import { AUTH_TABS } from '../config/constants'

import type { IAuthTabsLayoutProps } from './types'

const props = defineProps<IAuthTabsLayoutProps>()
const route = useRoute()
const router = useRouter()

const activePath = computed(() => route.path)

const selectAuthTab = async (value: string | number) => {
  if (props.blockNavigation) return

  await router.push(String(value))
}
</script>

<template>
  <main class="auth-tabs-layout">
    <RouterLink :to="ROUTE_NAMES.main" class="auth-tabs-layout__logo" :aria-label="CLIENT_ENV.appName">
      <img src="/img/Logo.svg" :alt="CLIENT_ENV.appName" />
    </RouterLink>

    <Card class="auth-tabs-layout__card">
      <template #content>
        <Tabs class="auth-tabs-layout__tabs" :value="activePath" @update:value="selectAuthTab">
          <TabList>
            <Tab v-for="tab in AUTH_TABS" :key="tab.path" :disabled="props.blockNavigation" :value="tab.path">
              {{ $t(tab.label) }}
            </Tab>
          </TabList>
        </Tabs>

        <slot />
      </template>
    </Card>
  </main>
</template>

<style scoped>
.auth-tabs-layout {
  position: relative;

  display: grid;
  place-items: center;

  min-height: 100dvh;
  padding: 16px;
}

.auth-tabs-layout__logo {
  position: fixed;
  top: 16px;
  left: 16px;

  display: grid;
  place-items: center;

  width: 44px;
  height: 44px;
  padding: 6px;
  border: 1px solid var(--dark-gray-transparent-2);
  border-radius: 12px;

  text-decoration: none;

  background: var(--surface-card);
  box-shadow: 8px 8px 18px var(--shadow-outset-start), -8px -8px 18px var(--shadow-outset-end);
}

.auth-tabs-layout__logo img {
  display: block;
  width: 100%;
  height: 100%;
}

.auth-tabs-layout__card {
  width: min(100%, 420px);
  border: 1px solid var(--dark-gray-transparent-2);
  border-radius: 8px;

  background: var(--surface-card);
  box-shadow: 16px 16px 36px var(--shadow-outset-start), -16px -16px 36px var(--shadow-outset-end);
}

.auth-tabs-layout__tabs {
  margin-bottom: 16px;
}

.auth-tabs-layout__tabs :deep(.p-tablist-tab-list) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.auth-tabs-layout__tabs :deep(.p-tab) {
  justify-content: center;
  width: 100%;
  padding-inline: 8px;
  text-align: center;
}
</style>
