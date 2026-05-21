<script setup lang="ts">
import { computed } from 'vue'
import Draggable from 'vuedraggable'

import { useChatRoomsList } from '../model/use-chat-rooms-list.model'

import ChatRoomListItem from './ChatRoomListItem.vue'

const { chatRoomList, searchQuery, reorderPinnedChatRooms } = useChatRoomsList()
const pinnedItems = computed(() => chatRoomList.value.filter(({ isPinned }) => isPinned))
const regularItems = computed(() => chatRoomList.value.filter(({ isPinned }) => !isPinned))
const canReorderPinnedItems = computed(() => !searchQuery.value.trim() && pinnedItems.value.length > 1)
</script>

<template>
  <div class="chat-room-list">
    <Draggable
      v-if="pinnedItems.length"
      class="chat-room-list__pinned"
      :model-value="pinnedItems"
      item-key="id"
      handle=".chat-room-list-item-pinned-badge"
      :animation="180"
      :disabled="!canReorderPinnedItems"
      ghost-class="chat-room-list__drag-ghost"
      chosen-class="chat-room-list__drag-chosen"
      drag-class="chat-room-list__drag-item"
      @update:model-value="reorderPinnedChatRooms"
    >
      <template #item="{ element }">
        <ChatRoomListItem :item="element" />
      </template>
    </Draggable>

    <div v-if="regularItems.length" class="chat-room-list__regular">
      <ChatRoomListItem v-for="item in regularItems" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<style lang="scss">
.chat-room-list,
.chat-room-list__pinned,
.chat-room-list__regular {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-room-list {
  padding: 8px;
}
</style>
