<script setup lang="ts">
import { NmorphText } from '@nmorph/nmorph-ui-kit'

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
    <NmorphText :color="props.color">{{ props.label }}</NmorphText>
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
