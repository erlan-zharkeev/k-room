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
      handle=".chat-room-list-item__pin"
      :animation="180"
      :disabled="!canReorderPinnedChatRooms"
      :force-fallback="true"
      :fallback-on-body="true"
      fallback-class="chat-room-list__drag-preview"
      ghost-class="chat-room-list__drop-placeholder"
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
  padding: 8px 0 8px 8px;
}

.chat-room-list__pinned {
  user-select: none;
}
</style>
