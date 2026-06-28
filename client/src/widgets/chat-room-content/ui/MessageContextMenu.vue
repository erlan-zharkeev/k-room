<script setup lang="ts">
import { NmorphContextMenu } from '@nmorph/nmorph-ui-kit'

import { MESSAGE_CONTEXT_MENU_WIDTH } from '../config/constants'
import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageContextMenuProps } from '../config/types'
import { useMessageContextMenu } from '../model/use-message-context-menu.model'

import MessageDeleteDialog from './MessageDeleteDialog.vue'
import MessageForwardDialog from './MessageForwardDialog.vue'

const props = defineProps<MessageContextMenuProps>()
const {
  isDeleteMessageDialogOpen,
  isMessageForwardDialogOpen,
  isMessageContextMenuOpen,
  messageContextMenuTrigger,
  messageContextMenuOptions,
  updateMessageContextMenuOpen
} = useMessageContextMenu(props)
</script>

<template>
  <NmorphContextMenu
    placement="bottom-start"
    :model-value="isMessageContextMenuOpen"
    class="message-context-menu"
    style="display: contents"
    :trigger="messageContextMenuTrigger"
    :width="MESSAGE_CONTEXT_MENU_WIDTH"
    :options="messageContextMenuOptions"
    :aria-label="$t(CHAT_ROOM_CONTENT_I18N.messageActions)"
    :close-on-scroll="false"
    hide-shadow
    @update:model-value="updateMessageContextMenuOpen"
  >
    <slot />
  </NmorphContextMenu>

  <MessageDeleteDialog v-model="isDeleteMessageDialogOpen" :message="props.message" :room-id="props.room.id" />
  <MessageForwardDialog
    v-if="isMessageForwardDialogOpen"
    v-model="isMessageForwardDialogOpen"
    :message="props.message"
    :source-room-id="props.room.id"
  />
</template>

<style lang="scss">
/* stylelint-disable property-no-vendor-prefix */
.message-context-menu,
.message-context-menu *,
.nmorph-context-menu__dropdown,
.nmorph-context-menu__dropdown * {
  -webkit-user-select: none;
  user-select: none;

  -webkit-touch-callout: none;
  -webkit-user-drag: none;
}
/* stylelint-enable property-no-vendor-prefix */

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
