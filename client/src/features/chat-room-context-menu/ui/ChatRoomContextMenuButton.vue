<script setup lang="ts">
import { NmorphButton, NmorphContextMenu, NmorphIcon, NmorphIconBurger } from '@nmorph/nmorph-ui-kit'

import { CHAT_ROOM_CONTEXT_MENU_I18N } from '../config/i18n'
import type { ChatRoomContextMenuEmits, ChatRoomContextMenuProps } from '../config/types'
import { useChatRoomContextMenu } from '../model/use-chat-room-context-menu.model'

const props = defineProps<ChatRoomContextMenuProps>()
const emit = defineEmits<ChatRoomContextMenuEmits>()
const { isContextMenuOpen, contextMenuOptions, selectChatRoomAction } = useChatRoomContextMenu(props, emit)
</script>

<template>
  <NmorphContextMenu
    v-model="isContextMenuOpen"
    placement="bottom-end"
    class="chat-room-context-menu"
    trigger="click"
    :options="contextMenuOptions"
    :aria-label="$t(CHAT_ROOM_CONTEXT_MENU_I18N.chatActions)"
    hide-shadow
    @select="selectChatRoomAction"
  >
    <NmorphButton
      design="plain"
      borderless
      shape="square"
      thickness="basic"
      :aria-label="$t(CHAT_ROOM_CONTEXT_MENU_I18N.chatActions)"
    >
      <template #icon-only>
        <NmorphIcon>
          <NmorphIconBurger />
        </NmorphIcon>
      </template>
    </NmorphButton>
  </NmorphContextMenu>
</template>
