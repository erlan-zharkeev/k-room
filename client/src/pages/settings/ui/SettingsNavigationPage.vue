<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useScreen } from 'src/shared/lib'
import { AppContentNavEl } from 'src/shared/ui'

import { getSettingsPath, SETTINGS_NAVIGATION_ITEMS } from '../config/constants'
import { getSettingsContentId } from '../lib/get-settings-content-id'

const route = useRoute()
const { isMobile } = useScreen()

const selectedSettingsId = computed(() => {
  const { settingsId } = route.params

  return getSettingsContentId(settingsId)
})

const getItemRoute = (settingsId: string) => ({
  path: getSettingsPath(settingsId),
  query: isMobile.value ? { ...route.query, view: 'content' } : route.query
})
</script>

<template>
  <nav class="settings-navigation-page">
    <AppContentNavEl
      v-for="item in SETTINGS_NAVIGATION_ITEMS"
      :key="item.id"
      :to="getItemRoute(item.id)"
      :active="selectedSettingsId === item.id"
      :ariaLabel="$t(item.label)"
      :label="$t(item.label)"
      :description="$t(item.description)"
    />
  </nav>
</template>

<style lang="scss">
.settings-navigation-page {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
}
</style>
