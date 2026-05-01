<script setup lang="ts">
import { isString } from 'lodash'
import { Button, OverlayBadge } from 'primevue'
import { computed, h, type FunctionalComponent } from 'vue'
import { useRoute } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useInfoNotification } from 'src/entities/info-notification'
import { MAIN_PAGE_NAV_ITEMS, MAIN_PAGE_ROUTES } from 'src/shared/config'

import { getBadgeValue, isNavBtnActive } from '../lib/template-helpers'

const props = defineProps<{ footer?: boolean }>()

const route = useRoute()
const { unreadInfoNotificationQuantity } = useInfoNotification()
const { unreadMessagesQuantity } = useChatRoom()

const selectedSettingsId = computed(() => {
  const { settingsId } = route.params

  return isString(settingsId) && settingsId ? settingsId : 'account'
})

const NavBadge: FunctionalComponent<{ value?: number }> = ({ value }, { slots }) =>
  value ? h(OverlayBadge, { value, severity: 'danger' }, slots) : slots.default?.()
</script>

<template>
  <nav class="main-navigation" :class="{ 'main-navigation--footer': props.footer }">
    <RouterLink
      v-for="item in MAIN_PAGE_NAV_ITEMS"
      :key="item.id"
      :to="item.id === 'settings' ? `${MAIN_PAGE_ROUTES.settings}/${selectedSettingsId}` : item.path"
      custom
      v-slot="{ href, navigate, isExactActive }"
    >
      <NavBadge :value="getBadgeValue(item.id, unreadInfoNotificationQuantity, unreadMessagesQuantity)">
        <Button
          :href="href"
          :aria-label="$t(item.label)"
          :pt="{
            root: { class: ['app-hoverless-btn'] }
          }"
          as="a"
          :text="!isNavBtnActive(item.id, isExactActive, route.path)"
          size="large"
          :icon="item.icon"
          @click="navigate"
        />
      </NavBadge>
    </RouterLink>
  </nav>
</template>

<style lang="scss">
.main-navigation {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  margin-block: auto;

  .p-overlaybadge .p-badge {
    transform: translate(15%, -50%);
    scale: 0.9;

    @include screen-mobile {
      transform: translate(30%, -20%);
    }
  }
}

.main-navigation--footer {
  flex-direction: row;
  justify-content: center;
  margin-block: 0;
}
</style>
