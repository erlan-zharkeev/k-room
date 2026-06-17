<script setup lang="ts">
import { AppText } from 'src/shared/ui'

import type { ChatRoomContextMenuActionButtonEmits, ChatRoomContextMenuActionButtonProps } from '../config/types'

const props = defineProps<ChatRoomContextMenuActionButtonProps>()
const emit = defineEmits<ChatRoomContextMenuActionButtonEmits>()
</script>

<template>
  <button
    class="chat-room-context-menu-action-button"
    type="button"
    :disabled="props.disabled"
    @click.stop="emit('select')"
  >
    <AppText :selectable="false" :text="props.label" />
  </button>
</template>

<style lang="scss">
.chat-room-context-menu-action-button {
  padding: 0;
  font: inherit;
}
</style>
