<script setup lang="ts">
import type { IChatRoomListEmits, IChatRoomListProps } from '../config/types'

import ChatRoomListItem from './ChatRoomListItem.vue'

const props = defineProps<IChatRoomListProps>()
const emit = defineEmits<IChatRoomListEmits>()
</script>

<template>
  <div class="chat-room-list">
    <ChatRoomListItem v-for="item in props.items" :key="item.id" :item="item" @select="emit('select', $event)" />
  </div>
</template>

<style lang="scss">
.chat-room-list {
  display: flex;
  gap: 8px;
  flex-direction: column;
  padding: 8px;
}
</style>
