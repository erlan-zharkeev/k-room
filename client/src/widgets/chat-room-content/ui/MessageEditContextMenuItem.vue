<script setup lang="ts">
import { NmorphIconEdit } from '@nmorph/nmorph-ui-kit'

import type { MessageContextMenuActionItemEmits, MessageContextMenuActionItemProps } from '../config/types'
import { useMessageEditContextMenuItem } from '../model/use-message-edit-context-menu-item.model'

import MessageContextMenuActionButton from './MessageContextMenuActionButton.vue'

const props = defineProps<MessageContextMenuActionItemProps>()
const emit = defineEmits<MessageContextMenuActionItemEmits>()
const { canStartMessageContextMenuEdit, messageEditContextMenuItemLabel, selectMessageEditContextMenuItem } =
  useMessageEditContextMenuItem(props, emit)
</script>

<template>
  <MessageContextMenuActionButton
    :label="messageEditContextMenuItemLabel"
    :disabled="!canStartMessageContextMenuEdit"
    @select="selectMessageEditContextMenuItem"
  >
    <template #icon>
      <NmorphIconEdit />
    </template>
  </MessageContextMenuActionButton>
</template>
