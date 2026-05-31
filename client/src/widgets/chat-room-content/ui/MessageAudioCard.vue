<script setup lang="ts">
import { NmorphAudioPreview } from '@nmorph/nmorph-ui-kit'

import type { MessageAudioCardProps } from '../config/types'
import { useMessageMediaCard } from '../model/use-message-media-card.model'

const props = defineProps<MessageAudioCardProps>()
const { mediaUrl: audioPreviewSrc } = useMessageMediaCard(() => props.audio)
</script>

<template>
  <NmorphAudioPreview
    v-if="audioPreviewSrc"
    :src="audioPreviewSrc"
    :name="props.audio.name"
    :download-href="audioPreviewSrc"
    width="100%"
    preload="metadata"
  />
</template>
