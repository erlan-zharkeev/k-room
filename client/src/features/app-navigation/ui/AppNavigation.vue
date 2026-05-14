<script setup lang="ts">
import { NmorphBadge, NmorphCard, NmorphIcon, NmorphRadio } from '@nmorph/nmorph-ui-kit'
import { isString } from 'lodash'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'

import { APP_PAGE_NAV_ITEMS, APP_PAGE_ROUTES } from '../config/constants'
import { getBadgeValue, isNavBtnActive } from '../lib/template-helpers'

import type { IAppNavigationProps } from './types'

const props = defineProps<IAppNavigationProps>()

const route = useRoute()
const { unreadMessagesQuantity } = useChatRoom()
const { invitationsQuantity } = useContact()

const selectedSettingsId = computed(() => {
  const { settingsId } = route.params
  return isString(settingsId) && settingsId ? settingsId : 'account'
})
</script>

<template>
  <NmorphCard
    tag="nav"
    :fill="false"
    shadow-type="inset"
    class="app-navigation"
    :class="{ 'app-navigation--footer': props.footer }"
  >
    <RouterLink
      v-for="item in APP_PAGE_NAV_ITEMS"
      :key="item.id"
      :to="item.id === 'settings' ? `${APP_PAGE_ROUTES.settings}/${selectedSettingsId}` : item.path"
      custom
      v-slot="{ navigate, isExactActive }"
    >
      <NmorphBadge
        :value="getBadgeValue(item.id, unreadMessagesQuantity, invitationsQuantity)"
        :offset-y="4"
        size="tiny"
      >
        <NmorphRadio
          @click="() => navigate()"
          :checked="isNavBtnActive(item.id, isExactActive, route.path)"
          height="basic"
        >
          <template #label>
            <NmorphIcon :color="isExactActive ? 'var(--nmorph-accent-color)' : 'var(--nmorph-text-color)'">
              <component :is="item.icon" />
            </NmorphIcon>
          </template>
        </NmorphRadio>
      </NmorphBadge>
    </RouterLink>
  </NmorphCard>
</template>

<style lang="scss">
.app-navigation {
  margin-block: auto;

  .nmorph-card__content {
    display: grid;
    gap: 16px;
  }
}

.app-navigation--footer {
  .nmorph-card__content {
    display: inline-flex;
  }
}
</style>
