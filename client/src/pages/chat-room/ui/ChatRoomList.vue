<script setup lang="ts">
import type { IChatRoomListProps } from '../config/types'

import ChatRoomListItem from './ChatRoomListItem.vue'

const props = defineProps<IChatRoomListProps>()
</script>

<template>
  <div class="chat-room-list">
    <ChatRoomListItem v-for="item in props.items" :key="item.id" :item="item" />
  </div>
</template>

<style lang="scss">
.chat-room-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
}
</style>
