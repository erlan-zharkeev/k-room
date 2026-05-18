<script setup lang="ts">
import { AppText } from 'src/shared/ui'

import type { IDateSeparatorProps } from '../config/types'
const props = defineProps<IDateSeparatorProps>()
</script>

<template>
  <AppText :text="props.label" alignment="center" color="contrast-text" class="date-separator" />
</template>

<style lang="scss">
.date-separator {
  display: block;
}
</style>
