<script setup lang="ts">
import type { ChatRoomContextMenuProps } from '../config/types'
import { useChatRoomContextMenuDialogs } from '../model/use-chat-room-context-menu-dialogs.model'

import ChatRoomContextMenuButton from './ChatRoomContextMenuButton.vue'
import ChatRoomDeleteDialog from './ChatRoomDeleteDialog.vue'
import ChatRoomFormDialog from './ChatRoomFormDialog.vue'
import ChatRoomLeaveDialog from './ChatRoomLeaveDialog.vue'

const props = defineProps<ChatRoomContextMenuProps>()
const {
  isChatRoomFormDialogOpen,
  isDeleteChatRoomDialogOpen,
  isLeaveChatRoomDialogOpen,
  openChatRoomFormDialog,
  openDeleteChatRoomDialog,
  openLeaveChatRoomDialog
} = useChatRoomContextMenuDialogs()
</script>

<template>
  <ChatRoomContextMenuButton
    :item="props.item"
    @edit-group="openChatRoomFormDialog"
    @delete-chat="openDeleteChatRoomDialog"
    @leave-group="openLeaveChatRoomDialog"
  />

  <ChatRoomFormDialog v-model="isChatRoomFormDialogOpen" :room-id="props.item.id" />

  <ChatRoomDeleteDialog v-model="isDeleteChatRoomDialogOpen" :item="props.item" />

  <ChatRoomLeaveDialog v-model="isLeaveChatRoomDialogOpen" :item="props.item" />
</template>
