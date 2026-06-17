<script setup lang="ts">
import { NmorphIconForwardFilled } from '@nmorph/nmorph-ui-kit'

import type { MessageContextMenuActionItemEmits, MessageContextMenuDialogActionItemProps } from '../config/types'
import { useMessageForwardContextMenuItem } from '../model/use-message-forward-context-menu-item.model'

import MessageContextMenuActionButton from './MessageContextMenuActionButton.vue'

const props = defineProps<MessageContextMenuDialogActionItemProps>()
const emit = defineEmits<MessageContextMenuActionItemEmits>()
const { messageForwardContextMenuItemLabel, selectMessageForwardContextMenuItem } = useMessageForwardContextMenuItem(
  props,
  emit
)
</script>

<template>
  <MessageContextMenuActionButton
    :label="messageForwardContextMenuItemLabel"
    @select="selectMessageForwardContextMenuItem"
  >
    <template #icon>
      <NmorphIconForwardFilled />
    </template>
  </MessageContextMenuActionButton>
</template>
