<script setup lang="ts">
import type { MessageDocumentListProps } from '../config/types'

import MessageDocumentCard from './MessageDocumentCard.vue'

const props = defineProps<MessageDocumentListProps>()
</script>

<template>
  <div v-if="props.documents.length" class="message-document-list">
    <MessageDocumentCard
      v-for="document in props.documents"
      :key="document.src"
      class="message-document-list__item"
      :document="document"
    />
  </div>
</template>

<style lang="scss">
.message-document-list {
  display: grid;
  gap: 4px;
}

.message-document-list__item {
  width: 100%;
}
</style>
