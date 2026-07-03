<script setup lang="ts">
import { useSettingsContentPage } from '../model/use-settings-content-page.model'

const { selectedSettingsComponent } = useSettingsContentPage()
</script>

<template>
  <component :is="selectedSettingsComponent" />
</template>

<style lang="scss" scoped>
.settings-content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 8px;
}

.settings-content-grid--compact-cards {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));

  @include screen-tablet {
    grid-template-columns: 1fr;
  }
}
</style>
