<script setup lang="ts">
import { AppText } from 'src/shared/ui'

import type { MessagePreviewProps } from '../config/types'

const props = defineProps<MessagePreviewProps>()
</script>

<template>
  <div class="message-preview">
    <AppText color="accent" :text="props.title" truncate />
    <AppText tag="small" color="semi-contrast-text" :text="props.text" :line-clamp="2" />
  </div>
</template>

<style lang="scss">
.message-preview {
  display: grid;
  padding-left: 8px;
  border-left: 2px solid var(--nmorph-accent-color);
}
</style>
