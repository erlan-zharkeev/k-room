<script setup lang="ts">
import { NmorphMediaGallery } from '@nmorph/nmorph-ui-kit'

import type { MessageMediaGalleryProps } from '../config/types'
import { useMessageMediaGallery } from '../model/use-message-media-gallery.model'

const props = defineProps<MessageMediaGalleryProps>()
const {
  activeGalleryIndex,
  galleryItems,
  hasGalleryItems,
  hasMediaItems,
  messageMediaGalleryPlaceholderStyle,
  messageMediaGalleryStyle
} = useMessageMediaGallery(props)
</script>

<template>
  <div v-if="hasMediaItems" class="message-media-gallery" :style="messageMediaGalleryStyle">
    <NmorphMediaGallery
      v-if="hasGalleryItems"
      v-model:active-index="activeGalleryIndex"
      :items="galleryItems"
      design="plain"
      image-fit="contain"
      video-fit="contain"
      trigger-image-fit="contain"
      trigger-video-fit="contain"
      show-trigger
      :show-trigger-name="false"
      :show-trigger-size="true"
      :show-trigger-actions="true"
      :show-trigger-preview-action="false"
      :show-trigger-fullscreen-action="false"
      :show-trigger-download-action="true"
      :show-file-name="false"
      :show-file-size="true"
      :show-file-actions="true"
    />
    <div
      v-else
      class="message-media-gallery__placeholder"
      :style="messageMediaGalleryPlaceholderStyle"
      aria-hidden="true"
    />
  </div>
</template>

<style lang="scss">
.message-media-gallery {
  width: 100%;
}

.message-media-gallery__placeholder {
  aspect-ratio: 16 / 9;
  width: 100%;
  border: var(--nmorph-plain-border);
  border-radius: var(--default-border-radius);

  background: color-mix(in srgb, var(--nmorph-accent-color) 6%, transparent);
}
</style>
