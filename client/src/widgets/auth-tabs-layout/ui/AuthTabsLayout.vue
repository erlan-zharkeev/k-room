<script setup lang="ts">
import { ROUTE_NAMES } from 'global-shared'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import type { IAuthTabsLayoutProps } from './types'

const props = defineProps<IAuthTabsLayoutProps>()
const route = useRoute()

const authTabs = [
  {
    label: 'Вход',
    path: ROUTE_NAMES.login
  },
  {
    label: 'Регистрация',
    path: ROUTE_NAMES.registration
  }
]

const activePath = computed(() => route.path)
</script>

<template>
  <main class="auth-tabs-layout">
    <RouterLink :to="ROUTE_NAMES.main" class="auth-tabs-layout__logo">K</RouterLink>

    <Card class="auth-tabs-layout__card">
      <template #content>
        <nav class="auth-tabs-layout__nav">
          <RouterLink v-for="tab in authTabs" :key="tab.path" :to="tab.path" custom v-slot="{ href, navigate }">
            <Button
              :href="href"
              :disabled="props.blockNavigation"
              :label="tab.label"
              :severity="activePath === tab.path ? 'primary' : 'secondary'"
              as="a"
              @click="navigate"
            />
          </RouterLink>
        </nav>

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

  width: 40px;
  height: 40px;
  border-radius: 50%;

  font-weight: 800;
  color: var(--white);
  text-decoration: none;

  background: var(--accent);
  box-shadow: 8px 8px 18px var(--shadow-outset-start), -8px -8px 18px var(--shadow-outset-end);
}

.auth-tabs-layout__card {
  width: min(100%, 420px);
  border: 1px solid var(--dark-gray-transparent-2);
  border-radius: 8px;

  background: var(--surface-card);
  box-shadow: 16px 16px 36px var(--shadow-outset-start), -16px -16px 36px var(--shadow-outset-end);
}

.auth-tabs-layout__nav {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.auth-tabs-layout__nav :deep(.p-button) {
  justify-content: center;
  width: 100%;
}
</style>
