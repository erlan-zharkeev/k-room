<script setup lang="ts">
import type { ChatRoomContextMenuActionItemEmits, ChatRoomContextMenuActionItemProps } from '../config/types'
import { useChatRoomPinContextMenuItem } from '../model/use-chat-room-pin-context-menu-item.model'

import ChatRoomContextMenuActionButton from './ChatRoomContextMenuActionButton.vue'

const props = defineProps<ChatRoomContextMenuActionItemProps>()
const emit = defineEmits<ChatRoomContextMenuActionItemEmits>()
const { canUpdatePinnedChatRoom, chatRoomPinContextMenuItemLabel, selectChatRoomPinContextMenuItem } =
  useChatRoomPinContextMenuItem(props, emit)
</script>

<template>
  <ChatRoomContextMenuActionButton
    :label="chatRoomPinContextMenuItemLabel"
    :disabled="!canUpdatePinnedChatRoom"
    @select="selectChatRoomPinContextMenuItem"
  />
</template>
