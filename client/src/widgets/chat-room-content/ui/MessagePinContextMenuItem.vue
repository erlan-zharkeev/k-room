<script setup lang="ts">
import { NmorphIconPin } from '@nmorph/nmorph-ui-kit'

import type { MessageContextMenuActionItemEmits, MessageContextMenuActionItemProps } from '../config/types'
import { useMessagePinContextMenuItem } from '../model/use-message-pin-context-menu-item.model'

import MessageContextMenuActionButton from './MessageContextMenuActionButton.vue'

const props = defineProps<MessageContextMenuActionItemProps>()
const emit = defineEmits<MessageContextMenuActionItemEmits>()
const { canUpdatePinnedMessage, messagePinContextMenuItemLabel, selectMessagePinContextMenuItem } =
  useMessagePinContextMenuItem(props, emit)
</script>

<template>
  <MessageContextMenuActionButton
    :label="messagePinContextMenuItemLabel"
    :disabled="!canUpdatePinnedMessage"
    @select="selectMessagePinContextMenuItem"
  >
    <template #icon>
      <NmorphIconPin />
    </template>
  </MessageContextMenuActionButton>
</template>
