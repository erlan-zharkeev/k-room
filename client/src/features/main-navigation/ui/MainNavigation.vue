<script setup lang="ts">
import { NmorphBadge, NmorphIcon, NmorphRadio } from '@nmorph/nmorph-ui-kit'
import { isString } from 'lodash'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useInfoNotification } from 'src/entities/info-notification'
import { MAIN_PAGE_NAV_ITEMS, MAIN_PAGE_ROUTES } from 'src/shared/config'
import { useScreen } from 'src/shared/lib'

import { getBadgeValue, isNavBtnActive } from '../lib/template-helpers'

const props = defineProps<{ footer?: boolean }>()

const { isPortraitTabletOrLess } = useScreen()

const route = useRoute()
const { unreadInfoNotificationQuantity } = useInfoNotification()
const { unreadMessagesQuantity } = useChatRoom()

const selectedSettingsId = computed(() => {
  const { settingsId } = route.params
  return isString(settingsId) && settingsId ? settingsId : 'account'
})
</script>

<template>
  <nav class="main-navigation nmorph--shadow-inset" :class="{ 'main-navigation--footer': props.footer }">
    <RouterLink
      v-for="item in MAIN_PAGE_NAV_ITEMS"
      :key="item.id"
      :to="item.id === 'settings' ? `${MAIN_PAGE_ROUTES.settings}/${selectedSettingsId}` : item.path"
      custom
      v-slot="{ navigate, isExactActive }"
    >
      <NmorphBadge
        :value="getBadgeValue(item.id, unreadInfoNotificationQuantity, unreadMessagesQuantity)"
        :offset-y="isPortraitTabletOrLess ? 4 : 10"
        size="tiny"
      >
        <NmorphRadio @click="() => navigate()" :checked="isNavBtnActive(item.id, isExactActive, route.path)">
          <template #label>
            <NmorphIcon :color="isExactActive ? 'var(--nmorph-accent-color)' : 'var(--nmorph-text-color)'">
              <component :is="item.icon" />
            </NmorphIcon>
          </template>
        </NmorphRadio>
      </NmorphBadge>
    </RouterLink>
  </nav>
</template>

<style lang="scss">
.main-navigation {
  display: grid;
  gap: 16px;
  margin-block: auto;
  padding: 8px;
}

.main-navigation--footer {
  display: inline-flex;
}
</style>
