<script setup lang="ts">
import { NmorphFileCard } from '@nmorph/nmorph-ui-kit'

import type { MessageFileListProps } from '../config/types'
import { useMessageFileList } from '../model/use-message-file-list.model'

const props = defineProps<MessageFileListProps>()
const { fileItems, hasFileItems } = useMessageFileList(props)
</script>

<template>
  <div v-if="hasFileItems" class="message-file-list">
    <div v-for="file in fileItems" :key="file.id" class="message-file-list__item">
      <NmorphFileCard
        :name="file.name"
        :mime-type="file.contentType"
        :size="file.size"
        :preview-src="file.previewSrc"
        :download-href="file.downloadHref"
        :media-preview="file.mediaPreview"
        surface="soft"
        :show-extension-badge="false"
        :icon-surface="false"
      />
    </div>
  </div>
</template>

<style lang="scss">
.message-file-list {
  display: grid;
  gap: 4px;
}

.message-file-list__item {
  width: 100%;
}
</style>
