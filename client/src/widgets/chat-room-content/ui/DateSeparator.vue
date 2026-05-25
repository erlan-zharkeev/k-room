<script setup lang="ts">
import { AppText } from 'src/shared/ui'

import type { DateSeparatorProps } from '../config/types'
const props = defineProps<DateSeparatorProps>()
</script>

<template>
  <AppText :text="props.label" alignment="center" color="contrast-text" class="date-separator" />
</template>

<style lang="scss">
.date-separator {
  display: block;
}
</style>
