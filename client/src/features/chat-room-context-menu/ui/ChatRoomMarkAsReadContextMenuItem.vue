<script setup lang="ts">
import type { ChatRoomContextMenuActionItemEmits, ChatRoomContextMenuActionItemProps } from '../config/types'
import { useChatRoomMarkAsReadContextMenuItem } from '../model/use-chat-room-mark-as-read-context-menu-item.model'

import ChatRoomContextMenuActionButton from './ChatRoomContextMenuActionButton.vue'

const props = defineProps<ChatRoomContextMenuActionItemProps>()
const emit = defineEmits<ChatRoomContextMenuActionItemEmits>()
const { canMarkChatRoomAsRead, chatRoomMarkAsReadContextMenuItemLabel, selectChatRoomMarkAsReadContextMenuItem } =
  useChatRoomMarkAsReadContextMenuItem(props, emit)
</script>

<template>
  <ChatRoomContextMenuActionButton
    :label="chatRoomMarkAsReadContextMenuItemLabel"
    :disabled="!canMarkChatRoomAsRead"
    @select="selectChatRoomMarkAsReadContextMenuItem"
  />
</template>
