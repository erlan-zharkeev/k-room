<script setup lang="ts">
import { NmorphText } from '@nmorph/nmorph-ui-kit'

import type { DateSeparatorProps } from '../config/types'
const props = defineProps<DateSeparatorProps>()
</script>

<template>
  <NmorphText align="center" color="var(--nmorph-contrast-text-color)" class="date-separator">{{
    props.label
  }}</NmorphText>
</template>

<style lang="scss">
.date-separator {
  display: block;
}
</style>
