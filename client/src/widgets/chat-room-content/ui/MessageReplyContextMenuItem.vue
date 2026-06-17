<script setup lang="ts">
import { NmorphIconReplyFilled } from '@nmorph/nmorph-ui-kit'

import type { MessageContextMenuActionItemEmits, MessageContextMenuActionItemProps } from '../config/types'
import { useMessageReplyContextMenuItem } from '../model/use-message-reply-context-menu-item.model'

import MessageContextMenuActionButton from './MessageContextMenuActionButton.vue'

const props = defineProps<MessageContextMenuActionItemProps>()
const emit = defineEmits<MessageContextMenuActionItemEmits>()
const { messageReplyContextMenuItemLabel, selectMessageReplyContextMenuItem } = useMessageReplyContextMenuItem(
  props,
  emit
)
</script>

<template>
  <MessageContextMenuActionButton :label="messageReplyContextMenuItemLabel" @select="selectMessageReplyContextMenuItem">
    <template #icon>
      <NmorphIconReplyFilled />
    </template>
  </MessageContextMenuActionButton>
</template>
