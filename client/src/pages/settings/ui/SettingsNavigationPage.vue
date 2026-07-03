<script setup lang="ts">
import { NmorphScroll } from '@nmorph/nmorph-ui-kit'

import { SETTINGS_NAVIGATION_ITEMS } from '../config/constants/content.constants'
import { useSettingsNavigationPage } from '../model/use-settings-navigation-page.model'

import { SettingsNavigationItem } from './SettingsNavigationItem'

const { selectedSettingsId, hasContentWarning, buildItemRoute } = useSettingsNavigationPage()
</script>

<template>
  <nav class="settings-navigation-page">
    <NmorphScroll scroll-x-prop="hidden">
      <div class="settings-navigation-page__list">
        <SettingsNavigationItem
          v-for="item in SETTINGS_NAVIGATION_ITEMS"
          :key="item.id"
          :to="buildItemRoute(item.id)"
          :active="selectedSettingsId === item.id"
          :ariaLabel="$t(item.label)"
          :label="$t(item.label)"
          :description="$t(item.description)"
          :has-warning="hasContentWarning(item.id)"
        />
      </div>
    </NmorphScroll>
  </nav>
</template>

<style lang="scss" scoped>
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
  padding: 8px;
}
</style>
