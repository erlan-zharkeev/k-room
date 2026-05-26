<script setup lang="ts">
import { AppText } from 'src/shared/ui'

import type { MessagePreviewProps } from '../config/types'

const props = defineProps<MessagePreviewProps>()
</script>

<template>
  <div class="message-preview">
    <AppText color="accent" :text="props.title" truncate />
    <AppText
      class="message-preview__text"
      tag="small"
      color="semi-contrast-text"
      :text="props.text"
    />
  </div>
</template>

<style lang="scss">
.message-preview {
  display: grid;
  padding-left: 8px;
  border-left: 2px solid var(--nmorph-accent-color);
}

.message-preview__text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
</style>
