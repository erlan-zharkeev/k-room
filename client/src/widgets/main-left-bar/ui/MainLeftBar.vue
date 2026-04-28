<script setup lang="ts">
import { isString } from 'global-shared'
import { Button, OverlayBadge } from 'primevue'
import { computed, h, type FunctionalComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useInfoNotification } from 'src/entities/info-notification'
import { AppLogo } from 'src/shared/ui'

import { MAIN_PAGE_NAV_ITEMS, MAIN_PAGE_ROUTES } from '../config/constants'

const route = useRoute()
const { unreadInfoNotificationQuantity } = useInfoNotification()
const { unreadMessagesQuantity } = useChatRoom()

const selectedSettingsId = computed(() => {
  const { settingsId } = route.params
  return isString(settingsId) && settingsId ? settingsId : 'account'
})

const isNavBtnActive = (id: string, isExactActive: boolean) =>
  isExactActive || (id === 'settings' && route.path.startsWith(MAIN_PAGE_ROUTES.settings))

const getBadgeValue = (id: string) => {
  if (id === 'settings') return unreadInfoNotificationQuantity.value || undefined
  if (id === 'chat-rooms') return unreadMessagesQuantity.value || undefined
}

const NavBadge: FunctionalComponent<{ value?: number }> = ({ value }, { slots }) =>
  value ? h(OverlayBadge, { value, severity: 'danger' }, slots) : slots.default?.()
</script>

<template>
  <aside class="main-left-bar">
    <AppLogo />

    <nav class="main-left-bar__nav">
      <RouterLink
        v-for="item in MAIN_PAGE_NAV_ITEMS"
        :key="item.id"
        :to="item.id === 'settings' ? `${MAIN_PAGE_ROUTES.settings}/${selectedSettingsId}` : item.path"
        custom
        v-slot="{ href, navigate, isExactActive }"
      >
        <NavBadge :value="getBadgeValue(item.id)">
          <Button
            :href="href"
            :aria-label="$t(item.label)"
            :pt="{
              root: { class: ['nav-button', { 'nav-button--active': isNavBtnActive(item.id, isExactActive) }] },
              icon: { class: { 'nav-button__icon--active': isNavBtnActive(item.id, isExactActive) } }
            }"
            as="a"
            text
            size="large"
            :icon="item.icon"
            @click="navigate"
          />
        </NavBadge>
      </RouterLink>
    </nav>
  </aside>
</template>

<style lang="scss">
.main-left-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-left-bar__nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  margin-block: auto;

  .nav-button:not(:disabled):hover {
    background: transparent;
  }

  .nav-button--active {
    background: var(--p-primary-color);
  }

  .nav-button__icon--active {
    color: var(--p-primary-contrast-color);
  }

  .nav-button--active.nav-button:not(:disabled):hover {
    background: var(--p-primary-color);
  }
}
</style>
