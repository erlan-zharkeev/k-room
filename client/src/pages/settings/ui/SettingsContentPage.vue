<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { SETTINGS_CONTENT_COMPONENTS } from '../config/constants/content.constants'
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
