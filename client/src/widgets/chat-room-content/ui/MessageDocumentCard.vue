<script setup lang="ts">
import { NmorphFileCard } from '@nmorph/nmorph-ui-kit'

import type { MessageDocumentCardProps } from '../config/types'
import { useMessageDocumentCard } from '../model/use-message-document-card.model'

const props = defineProps<MessageDocumentCardProps>()
const { documentDownloadHref } = useMessageDocumentCard(props)
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
