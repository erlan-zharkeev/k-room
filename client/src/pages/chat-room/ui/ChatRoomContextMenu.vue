<script setup lang="ts">
import { NmorphCheckbox, NmorphContextMenu, NmorphIcon, NmorphIconMore } from '@nmorph/nmorph-ui-kit'

import { useScreen } from 'src/shared/lib'

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
const { isPortraitTabletOrLess } = useScreen()
</script>

<template>
  <NmorphContextMenu
    :placement="isPortraitTabletOrLess ? 'bottom-end' : 'bottom-end'"
    :model-value="isContextMenuOpen"
    class="chat-room-context-menu"
    trigger="click"
    :options="contextMenuOptions"
    :aria-label="$t(CHAT_ROOM_PAGE_I18N.chatActions)"
    @update:model-value="setContextMenuOpen"
    @select="selectChatRoomAction"
  >
    <NmorphCheckbox
      design="button"
      height="basic"
      :model-value="isContextMenuOpen"
      :aria-label="$t(CHAT_ROOM_PAGE_I18N.chatActions)"
    >
      <template #label>
        <NmorphIcon>
          <NmorphIconMore />
        </NmorphIcon>
      </template>
    </NmorphCheckbox>
  </NmorphContextMenu>

  <ChatRoomFormDialog v-model="isChatRoomFormDialogOpen" :room-id="props.item.id" />

  <ChatRoomDeleteDialog v-model="isDeleteChatRoomDialogOpen" :item="props.item" />

  <ChatRoomLeaveDialog v-model="isLeaveChatRoomDialogOpen" :item="props.item" />
</template>
