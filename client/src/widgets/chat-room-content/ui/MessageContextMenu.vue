<script setup lang="ts">
import { NmorphContextMenu } from '@nmorph/nmorph-ui-kit'

import { MESSAGE_CONTEXT_MENU_WIDTH } from '../config/constants'
import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageContextMenuProps } from '../config/types'
import { useMessageContextMenu } from '../model/use-message-context-menu.model'

import MessageDeleteDialog from './MessageDeleteDialog.vue'

const props = defineProps<MessageContextMenuProps>()
const {
  isDeleteMessageDialogOpen,
  isMessageContextMenuOpen,
  isMessageContextMenuDisabled,
  messageContextMenuOptions,
  updateMessageContextMenuOpen,
  selectMessageContextMenuAction
} = useMessageContextMenu(props)
</script>

<template>
  <NmorphContextMenu
    placement="bottom-start"
    :model-value="isMessageContextMenuOpen"
    class="message-context-menu"
    trigger="contextmenu"
    :width="MESSAGE_CONTEXT_MENU_WIDTH"
    :options="messageContextMenuOptions"
    :aria-label="$t(CHAT_ROOM_CONTENT_I18N.messageActions)"
    :disabled="isMessageContextMenuDisabled"
    :close-on-scroll="false"
    hide-shadow
    @update:model-value="updateMessageContextMenuOpen"
    @select="selectMessageContextMenuAction"
  >
    <slot />
  </NmorphContextMenu>

  <MessageDeleteDialog v-model="isDeleteMessageDialogOpen" :message="props.message" :room-id="props.room.id" />
</template>

<style lang="scss">
.message-context-menu {
  display: contents;
}

.nmorph-context-menu__options:has(> .nmorph-context-menu__item .message-reaction-picker) {
  padding: 0 0 4px;
}

.nmorph-context-menu__item:has(.message-reaction-picker) {
  padding: 8px;
}

.nmorph-context-menu__item:has(.message-reaction-picker):hover {
  background: transparent;
}
</style>
