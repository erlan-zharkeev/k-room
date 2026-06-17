<script setup lang="ts">
import { NmorphIconCopy } from '@nmorph/nmorph-ui-kit'

import type { MessageContextMenuActionItemEmits, MessageContextMenuActionItemProps } from '../config/types'
import { useMessageCopyTextContextMenuItem } from '../model/use-message-copy-text-context-menu-item.model'

import MessageContextMenuActionButton from './MessageContextMenuActionButton.vue'

const props = defineProps<MessageContextMenuActionItemProps>()
const emit = defineEmits<MessageContextMenuActionItemEmits>()
const { canCopyMessageText, messageCopyTextContextMenuItemLabel, selectMessageCopyTextContextMenuItem } =
  useMessageCopyTextContextMenuItem(props, emit)
</script>

<template>
  <MessageContextMenuActionButton
    :label="messageCopyTextContextMenuItemLabel"
    :disabled="!canCopyMessageText"
    @select="selectMessageCopyTextContextMenuItem"
  >
    <template #icon>
      <NmorphIconCopy />
    </template>
  </MessageContextMenuActionButton>
</template>
