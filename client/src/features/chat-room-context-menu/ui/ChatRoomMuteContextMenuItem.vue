<script setup lang="ts">
import type { ChatRoomContextMenuActionItemEmits, ChatRoomContextMenuActionItemProps } from '../config/types'
import { useChatRoomMuteContextMenuItem } from '../model/use-chat-room-mute-context-menu-item.model'

import ChatRoomContextMenuActionButton from './ChatRoomContextMenuActionButton.vue'

const props = defineProps<ChatRoomContextMenuActionItemProps>()
const emit = defineEmits<ChatRoomContextMenuActionItemEmits>()
const { canUpdateMutedChatRoom, chatRoomMuteContextMenuItemLabel, selectChatRoomMuteContextMenuItem } =
  useChatRoomMuteContextMenuItem(props, emit)
</script>

<template>
  <ChatRoomContextMenuActionButton
    :label="chatRoomMuteContextMenuItemLabel"
    :disabled="!canUpdateMutedChatRoom"
    @select="selectChatRoomMuteContextMenuItem"
  />
</template>
