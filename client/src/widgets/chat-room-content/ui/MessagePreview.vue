<script setup lang="ts">
import { NmorphText } from '@nmorph/nmorph-ui-kit'

import type { MessagePreviewProps } from '../config/types'

const props = defineProps<MessagePreviewProps>()
</script>

<template>
  <div class="message-preview">
    <NmorphText color="accent" truncate>{{ props.title }}</NmorphText>
    <NmorphText as="small" color="semi-contrast" :line-clamp="2" variant="body-small">{{ props.text }}</NmorphText>
  </div>
</template>

<style lang="scss" scoped>
.message-preview {
  display: grid;
  padding-left: 8px;
  border-left: 2px solid var(--nmorph-accent-color);
}
</style>
