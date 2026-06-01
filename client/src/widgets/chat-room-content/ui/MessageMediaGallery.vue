<script setup lang="ts">
import { NmorphMediaGallery } from '@nmorph/nmorph-ui-kit'

import type { MessageMediaGalleryProps } from '../config/types'
import { useMessageMediaGallery } from '../model/use-message-media-gallery.model'

const props = defineProps<MessageMediaGalleryProps>()
const { activeGalleryIndex, galleryItems, hasGalleryItems } = useMessageMediaGallery(props)
</script>

<template>
  <NmorphMediaGallery
    v-if="hasGalleryItems"
    v-model:active-index="activeGalleryIndex"
    :items="galleryItems"
    image-fit="contain"
    video-fit="contain"
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
</template>
