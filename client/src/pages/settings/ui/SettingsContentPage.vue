<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import {
  DEFAULT_SETTINGS_CONTENT_ID,
  isSettingsContentId,
  SETTINGS_CONTENT_COMPONENTS
} from '../config/constants'

const route = useRoute()

const selectedSettingsId = computed(() => {
  const { settingsId } = route.params

  return isSettingsContentId(settingsId) ? settingsId : DEFAULT_SETTINGS_CONTENT_ID
})

const selectedSettingsComponent = computed(() => SETTINGS_CONTENT_COMPONENTS[selectedSettingsId.value])
</script>

<template>
  <component :is="selectedSettingsComponent" />
</template>
