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
      class="chat-room-list__pinned app-list-motion-container"
      :model-value="chatRoomListGroups.pinnedChatRoomList"
      item-key="id"
      tag="transition-group"
      :component-data="{ name: 'app-list-motion' }"
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
        <div class="app-list-motion-item">
          <ChatRoomListItem :item="element" />
        </div>
      </template>
    </Draggable>

    <TransitionGroup
      v-if="chatRoomListGroups.regularChatRoomList.length"
      class="chat-room-list__regular app-list-motion-container"
      name="app-list-motion"
      tag="div"
    >
      <div v-for="item in chatRoomListGroups.regularChatRoomList" :key="item.id" class="app-list-motion-item">
        <ChatRoomListItem :item="item" />
      </div>
    </TransitionGroup>
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

.chat-room-list__pinned {
  user-select: none;
}
</style>
