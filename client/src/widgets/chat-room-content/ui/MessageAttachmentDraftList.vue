<script setup lang="ts">
import { NmorphButton, NmorphFileCard, NmorphIcon, NmorphIconClose } from '@nmorph/nmorph-ui-kit'

import { AppMediaImage } from 'src/shared/ui'

import {
  MESSAGE_ATTACHMENT_AUDIO_WIDTH_PX,
  MESSAGE_ATTACHMENT_DOCUMENT_WIDTH_PX,
  MESSAGE_ATTACHMENT_DRAFT_IMAGE_SIZE_PX,
  MESSAGE_ATTACHMENT_DRAFT_KIND
} from '../config/constants'
import type { MessageAttachmentDraftListEmits, MessageAttachmentDraftListProps } from '../config/types'

const props = defineProps<MessageAttachmentDraftListProps>()
const emit = defineEmits<MessageAttachmentDraftListEmits>()
</script>

<template>
  <div v-if="props.attachments.length" class="message-attachment-draft-list">
    <div
      v-for="attachment in props.attachments"
      :key="attachment.src"
      class="message-attachment-draft-list__item"
      :class="`message-attachment-draft-list__item--${attachment.kind}`"
    >
      <AppMediaImage
        v-if="attachment.kind === MESSAGE_ATTACHMENT_DRAFT_KIND.IMAGE"
        :media-id="attachment.src"
        :alt="attachment.name"
        :width="`${MESSAGE_ATTACHMENT_DRAFT_IMAGE_SIZE_PX}px`"
        :height="`${MESSAGE_ATTACHMENT_DRAFT_IMAGE_SIZE_PX}px`"
      />
      <NmorphFileCard
        v-else-if="attachment.kind === MESSAGE_ATTACHMENT_DRAFT_KIND.DOCUMENT"
        :style="{ width: `${MESSAGE_ATTACHMENT_DOCUMENT_WIDTH_PX}px` }"
        :name="attachment.name"
        :mime-type="attachment.contentType"
        :size="attachment.size"
        :show-default-actions="false"
        surface="soft"
        :show-extension-badge="false"
        :icon-surface="false"
        compact
      />
      <NmorphFileCard
        v-else-if="attachment.kind === MESSAGE_ATTACHMENT_DRAFT_KIND.AUDIO"
        :style="{ width: `${MESSAGE_ATTACHMENT_AUDIO_WIDTH_PX}px` }"
        :name="attachment.name"
        :mime-type="attachment.contentType"
        :size="attachment.size"
        :show-default-actions="false"
        surface="soft"
        :show-extension-badge="false"
        :icon-surface="false"
        compact
      />
      <NmorphButton
        class="message-attachment-draft-list__remove"
        shape="circle"
        style-type="transparent"
        :aria-label="props.removeAriaLabel"
        @click="emit('remove', attachment)"
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
.message-attachment-draft-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.message-attachment-draft-list__item {
  position: relative;
}

.message-attachment-draft-list__remove {
  position: absolute;
  top: 2px;
  right: 2px;

  border-radius: 2px;

  color: var(--nmorph-contrast-text-color);

  background: var(--app-shadow-dark);
}
</style>
