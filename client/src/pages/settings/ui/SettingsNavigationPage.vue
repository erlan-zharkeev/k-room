<script setup lang="ts">
import { NmorphScroll } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useScreen } from 'src/shared/lib'
import { AppContentNavEl } from 'src/shared/ui'

import { getSettingsPath, SETTINGS_NAVIGATION_ITEMS } from '../config/constants/content.constants'
import { getSettingsContentId } from '../lib/get-settings-content-id'

const route = useRoute()
const { isPortraitTabletOrLess } = useScreen()

const selectedSettingsId = computed(() => {
  const { settingsId } = route.params

  return getSettingsContentId(settingsId)
})

const getItemRoute = (settingsId: string) => ({
  path: getSettingsPath(settingsId),
  query: isPortraitTabletOrLess.value ? { ...route.query, view: 'content' } : route.query
})
</script>

<template>
  <nav class="settings-navigation-page">
    <NmorphScroll scroll-x-prop="hidden">
      <div class="settings-navigation-page__list">
        <AppContentNavEl
          v-for="item in SETTINGS_NAVIGATION_ITEMS"
          :key="item.id"
          :to="getItemRoute(item.id)"
          :active="selectedSettingsId === item.id"
          :ariaLabel="$t(item.label)"
          :label="$t(item.label)"
          :description="$t(item.description)"
        />
      </div>
    </NmorphScroll>
  </nav>
</template>

<style lang="scss">
.settings-navigation-page {
  overflow-x: hidden;
  height: 100%;
  min-height: 0;
}

.settings-navigation-page__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
</style>
