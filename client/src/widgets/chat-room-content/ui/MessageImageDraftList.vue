<script setup lang="ts">
import { NmorphButton, NmorphIcon, NmorphIconClose } from '@nmorph/nmorph-ui-kit'

import { AppMediaImage } from 'src/shared/ui'

import type { MessageImageDraftListEmits, MessageImageDraftListProps } from '../config/types'

const props = defineProps<MessageImageDraftListProps>()
const emit = defineEmits<MessageImageDraftListEmits>()
</script>

<template>
  <div v-if="props.images.length" class="message-image-draft-list">
    <div v-for="image in props.images" :key="image.src" class="message-image-draft-list__item">
      <AppMediaImage :media-id="image.src" :alt="image.name" width="56px" height="56px" />
      <NmorphButton
        class="message-image-draft-list__remove"
        shape="circle"
        style-type="transparent"
        :aria-label="props.removeAriaLabel"
        @click="emit('remove', image.src)"
      >
        <template #icon-only>
          <NmorphIcon color="var(--nmorph-contrast-text-color)">
            <NmorphIconClose />
          </NmorphIcon>
        </template>
      </NmorphButton>
    </div>
  </div>
</template>

<style lang="scss">
.message-image-draft-list {
  display: flex;
  gap: 8px;
}

.message-image-draft-list__item {
  position: relative;
}

.message-image-draft-list__remove {
  position: absolute;
  top: 2px;
  right: 2px;

  border-radius: 2px;

  color: var(--nmorph-contrast-text-color);

  background: var(--app-shadow-dark);
}

.message-image-draft-list__remove:hover,
.message-image-draft-list__remove:active,
.message-image-draft-list__remove:focus-visible {
  color: var(--nmorph-contrast-text-color);
}
</style>
