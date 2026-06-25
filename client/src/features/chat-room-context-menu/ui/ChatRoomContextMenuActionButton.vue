<script setup lang="ts">
import { NmorphText } from '@nmorph/nmorph-ui-kit'

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
    <NmorphText>{{ props.label }}</NmorphText>
  </button>
</template>

<style lang="scss">
.chat-room-context-menu-action-button {
  padding: 0;
  font: inherit;
}
</style>
