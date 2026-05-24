<script setup lang="ts">
import { NmorphButton, NmorphContextMenu, NmorphIcon, NmorphIconBurger } from '@nmorph/nmorph-ui-kit'

import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'
import type { ChatRoomContextMenuProps } from '../config/types'
import { useChatRoomContextMenu } from '../model/use-chat-room-context-menu.model'

import ChatRoomDeleteDialog from './ChatRoomDeleteDialog.vue'
import ChatRoomFormDialog from './ChatRoomFormDialog.vue'
import ChatRoomLeaveDialog from './ChatRoomLeaveDialog.vue'

const props = defineProps<ChatRoomContextMenuProps>()
const {
  contextMenuOptions,
  isChatRoomFormDialogOpen,
  isContextMenuOpen,
  isDeleteChatRoomDialogOpen,
  isLeaveChatRoomDialogOpen,
  selectChatRoomAction,
  setContextMenuOpen
} = useChatRoomContextMenu(props)
</script>

<template>
  <NmorphContextMenu
    placement="bottom-end"
    :model-value="isContextMenuOpen"
    class="chat-room-context-menu"
    trigger="click"
    :options="contextMenuOptions"
    :aria-label="$t(CHAT_ROOM_PAGE_I18N.chatActions)"
    hide-shadow
    @update:model-value="setContextMenuOpen"
    @select="selectChatRoomAction"
  >
    <NmorphButton
      style-type="transparent"
      shape="square"
      height="basic"
      :aria-label="$t(CHAT_ROOM_PAGE_I18N.chatActions)"
    >
      <template #icon-only>
        <NmorphIcon>
          <NmorphIconBurger />
        </NmorphIcon>
      </template>
    </NmorphButton>
  </NmorphContextMenu>

  <ChatRoomFormDialog v-model="isChatRoomFormDialogOpen" :room-id="props.item.id" />

  <ChatRoomDeleteDialog v-model="isDeleteChatRoomDialogOpen" :item="props.item" />

  <ChatRoomLeaveDialog v-model="isLeaveChatRoomDialogOpen" :item="props.item" />
</template>
