<script setup lang="ts">
import { NmorphContextMenu } from '@nmorph/nmorph-ui-kit'

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
    :options="messageContextMenuOptions"
    :aria-label="$t(CHAT_ROOM_CONTENT_I18N.messageActions)"
    :disabled="isMessageContextMenuDisabled"
    hide-shadow
    @update:model-value="updateMessageContextMenuOpen"
    @select="selectMessageContextMenuAction"
  >
    <slot />
  </NmorphContextMenu>

  <MessageDeleteDialog v-model="isDeleteMessageDialogOpen" :message="props.message" :room-id="props.roomId" />
</template>

<style lang="scss">
.message-context-menu {
  display: contents;
}
</style>
