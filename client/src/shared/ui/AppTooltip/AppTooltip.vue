<script setup lang="ts">
import { NmorphTooltip } from '@nmorph/nmorph-ui-kit'

import type { AppTooltipProps } from './types'
import { useAppTooltip } from './use-app-tooltip.model'

const props = defineProps<AppTooltipProps>()
const { showTooltip } = useAppTooltip(props)
</script>

<template>
  <NmorphTooltip v-if="showTooltip" :text="props.text" :position="props.position" :max-width="props.maxWidth">
    <slot />
  </NmorphTooltip>
  <slot v-else />
</template>
