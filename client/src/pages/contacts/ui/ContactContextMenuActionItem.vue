<script setup lang="ts">
import { AppText } from 'src/shared/ui'

import type { ContactContextMenuActionItemEmits, ContactContextMenuActionItemProps } from '../config/types'
import { useContactContextMenuActionItem } from '../model/use-contact-context-menu-action-item.model'

const props = defineProps<ContactContextMenuActionItemProps>()
const emit = defineEmits<ContactContextMenuActionItemEmits>()
const { selectContactContextMenuAction } = useContactContextMenuActionItem(props, emit)
</script>

<template>
  <button
    class="contact-context-menu-action-item"
    type="button"
    :disabled="props.disabled"
    @click.stop="selectContactContextMenuAction"
  >
    <AppText :selectable="false" :text="props.label" :color="props.color" />
  </button>
</template>

<style lang="scss">
.contact-context-menu-action-item {
  width: 100%;
  padding: 0;
  font: inherit;
  text-align: left;
}
</style>
