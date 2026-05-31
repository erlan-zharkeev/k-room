<script setup lang="ts">
import { NmorphFileCard } from '@nmorph/nmorph-ui-kit'

import type { MessageDocumentCardProps } from '../config/types'
import { useMessageMediaCard } from '../model/use-message-media-card.model'

const props = defineProps<MessageDocumentCardProps>()
const { mediaUrl: documentDownloadHref } = useMessageMediaCard(() => props.document)
</script>

<template>
  <NmorphFileCard
    :name="props.document.name"
    :mime-type="props.document.contentType"
    :size="props.document.size"
    :download-href="documentDownloadHref"
    surface="soft"
    :show-extension-badge="false"
    :icon-surface="false"
  />
</template>
