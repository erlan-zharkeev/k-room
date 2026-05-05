<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { SETTINGS_CONTENT_COMPONENTS } from '../config/constants'
import { getSettingsContentId } from '../lib/get-settings-content-id'

const route = useRoute()

const selectedSettingsId = computed(() => {
  const { settingsId } = route.params

  return getSettingsContentId(settingsId)
})

const selectedSettingsComponent = computed(() => SETTINGS_CONTENT_COMPONENTS[selectedSettingsId.value])
</script>

<template>
  <component :is="selectedSettingsComponent" />
</template>

<style lang="scss">
.settings-content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
  padding: 16px;

  @include screen-mobile {
    grid-template-columns: 1fr;
  }
}
</style>
