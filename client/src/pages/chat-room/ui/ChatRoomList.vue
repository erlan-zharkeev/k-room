<script setup lang="ts">
import Draggable from 'vuedraggable'

import { useChatRoomsList } from '../model/use-chat-rooms-list.model'

import ChatRoomListItem from './ChatRoomListItem.vue'

const { chatRoomListGroups, canReorderPinnedChatRooms, reorderPinnedChatRooms } = useChatRoomsList()
</script>

<template>
  <div class="chat-room-list">
    <Draggable
      v-if="chatRoomListGroups.pinnedChatRoomList.length"
      class="chat-room-list__pinned"
      :model-value="chatRoomListGroups.pinnedChatRoomList"
      item-key="id"
      handle=".chat-room-list-item-pinned-badge"
      :animation="180"
      :disabled="!canReorderPinnedChatRooms"
      ghost-class="chat-room-list__drag-ghost"
      chosen-class="chat-room-list__drag-chosen"
      drag-class="chat-room-list__drag-item"
      @update:model-value="reorderPinnedChatRooms"
    >
      <template #item="{ element }">
        <ChatRoomListItem :item="element" />
      </template>
    </Draggable>

    <div v-if="chatRoomListGroups.regularChatRoomList.length" class="chat-room-list__regular">
      <ChatRoomListItem v-for="item in chatRoomListGroups.regularChatRoomList" :key="item.id" :item="item" />
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
