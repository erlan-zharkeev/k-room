<script setup lang="ts">
import { NmorphIconDelete } from '@nmorph/nmorph-ui-kit'

import type { MessageContextMenuActionItemEmits, MessageContextMenuDialogActionItemProps } from '../config/types'
import { useMessageDeleteContextMenuItem } from '../model/use-message-delete-context-menu-item.model'

import MessageContextMenuActionButton from './MessageContextMenuActionButton.vue'

const props = defineProps<MessageContextMenuDialogActionItemProps>()
const emit = defineEmits<MessageContextMenuActionItemEmits>()
const { messageDeleteContextMenuItemLabel, selectMessageDeleteContextMenuItem } = useMessageDeleteContextMenuItem(
  props,
  emit
)
</script>

<template>
  <MessageContextMenuActionButton
    :label="messageDeleteContextMenuItemLabel"
    @select="selectMessageDeleteContextMenuItem"
  >
    <template #icon>
      <NmorphIconDelete />
    </template>
  </MessageContextMenuActionButton>
</template>
