<script setup lang="ts">
import { NmorphBadge, NmorphCard, NmorphIcon, NmorphRadio } from '@nmorph/nmorph-ui-kit'

import { APP_PAGE_NAV_ITEMS } from '../config/constants'
import { getBadgeValue, isNavBtnActive } from '../lib/template-helpers'
import { useAppNavigation } from '../model/use-app-navigation.model'

import type { AppNavigationProps } from './types'

const props = defineProps<AppNavigationProps>()
const { routePath, buildNavigationRoute, unreadMessagesQuantity, invitationsQuantity, hasSettingsWarning } =
  useAppNavigation()
</script>

<template>
  <NmorphCard
    tag="nav"
    :fill="false"
    shadow-type="inset"
    class="app-navigation"
    :class="{ 'app-navigation--footer': props.footer }"
    content-class="app-navigation__content"
  >
    <RouterLink
      v-for="item in APP_PAGE_NAV_ITEMS"
      :key="item.id"
      :to="buildNavigationRoute(item.id, item.path, props.footer)"
      custom
      v-slot="{ navigate, isExactActive }"
    >
      <NmorphBadge
        :value="getBadgeValue(item.id, unreadMessagesQuantity, invitationsQuantity, hasSettingsWarning)"
        color="var(--nmorph-warn-text-color)"
        :offset-y="4"
        size="tiny"
      >
        <NmorphRadio
          @click="() => navigate()"
          :checked="isNavBtnActive(item.id, isExactActive, routePath)"
          thickness="basic"
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
}

.app-navigation__content {
  display: grid;
  gap: 16px;
}

.app-navigation--footer .app-navigation__content {
  display: inline-flex;
}
</style>
