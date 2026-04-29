<script setup lang="ts">
import { isString } from 'global-shared'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { MAIN_PAGE_SETTINGS_ITEMS, getMainPageSettingsPath } from 'src/pages/main'
import { useScreen } from 'src/shared/lib'
import { AppContentNavEl } from 'src/shared/ui'

const route = useRoute()
const { isMobile } = useScreen()

const selectedSettingsId = computed(() => {
  const { settingsId } = route.params

  return isString(settingsId) && settingsId ? settingsId : MAIN_PAGE_SETTINGS_ITEMS[0].id
})

const getItemRoute = (settingsId: string) => ({
  path: getMainPageSettingsPath(settingsId),
  query: isMobile.value ? { ...route.query, view: 'content' } : route.query
})
</script>

<template>
  <nav class="settings-navigation-page">
    <AppContentNavEl
      v-for="item in MAIN_PAGE_SETTINGS_ITEMS"
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
}
</style>
