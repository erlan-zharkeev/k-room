<script setup lang="ts">
import { NmorphIcon } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import type { MessageContextMenuActionButtonEmits, MessageContextMenuActionButtonProps } from '../config/types'

const props = defineProps<MessageContextMenuActionButtonProps>()
const emit = defineEmits<MessageContextMenuActionButtonEmits>()
</script>

<template>
  <button
    class="message-context-menu-action-button"
    type="button"
    :disabled="props.disabled"
    @click.stop="emit('select')"
  >
    <NmorphIcon v-if="$slots.icon" class="message-context-menu-action-button__icon">
      <slot name="icon" />
    </NmorphIcon>
    <AppText :selectable="false" :text="props.label" />
  </button>
</template>

<style lang="scss">
.message-context-menu-action-button {
  display: flex;
  gap: 10px;
  align-items: center;

  width: 100%;
  padding: 0;

  font: inherit;
  text-align: left;
}

.message-context-menu-action-button__icon {
  flex: 0 0 auto;
}
</style>
