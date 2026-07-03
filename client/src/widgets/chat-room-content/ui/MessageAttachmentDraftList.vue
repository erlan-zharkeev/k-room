<script setup lang="ts">
import { NmorphButton, NmorphFileCard, NmorphIcon, NmorphIconClose, NmorphScroll } from '@nmorph/nmorph-ui-kit'

import {
  MESSAGE_ATTACHMENT_DRAFT_LIST_HEIGHT_PX,
  MESSAGE_ATTACHMENT_FILE_CARD_HEIGHT_PX,
  MESSAGE_ATTACHMENT_SCROLL_X_BAR_WIDTH_PX,
  MESSAGE_ATTACHMENT_SCROLL_X_GAP_PX
} from '../config/constants'
import type { MessageAttachmentDraftListEmits, MessageAttachmentDraftListProps } from '../config/types'
import { resolveMessageAttachmentDraftFileCardStyle } from '../lib/resolve-message-attachment-draft-file-card-style'
import { resolveMessageAttachmentDraftMediaPreview } from '../lib/resolve-message-attachment-draft-media-preview'
import { useMessageAttachmentDraftList } from '../model/use-message-attachment-draft-list.model'

const props = defineProps<MessageAttachmentDraftListProps>()
const emit = defineEmits<MessageAttachmentDraftListEmits>()
const { openAttachmentPreview, resolveAttachmentPreviewSrc } = useMessageAttachmentDraftList(props)
</script>

<template>
  <NmorphScroll
    v-if="props.attachments.length"
    class="message-attachment-draft-list"
    :height="`${MESSAGE_ATTACHMENT_DRAFT_LIST_HEIGHT_PX}px`"
    scroll-x-prop="auto"
    scroll-y-prop="hidden"
    :x-bar-width-in-px="MESSAGE_ATTACHMENT_SCROLL_X_BAR_WIDTH_PX"
    :x-gap-in-px="MESSAGE_ATTACHMENT_SCROLL_X_GAP_PX"
  >
    <div
      v-for="attachment in props.attachments"
      :key="attachment.src"
      class="message-attachment-draft-list__item"
      :style="resolveMessageAttachmentDraftFileCardStyle(attachment)"
    >
      <NmorphFileCard
        :name="attachment.name"
        :mime-type="attachment.contentType"
        :size="attachment.size"
        :preview-src="resolveAttachmentPreviewSrc(attachment)"
        :media-preview="resolveMessageAttachmentDraftMediaPreview(attachment)"
        :height="`${MESSAGE_ATTACHMENT_FILE_CARD_HEIGHT_PX}px`"
        surface="soft"
        :show-extension-badge="false"
        :icon-surface="false"
        compact
        @open="openAttachmentPreview(attachment, resolveAttachmentPreviewSrc(attachment))"
      >
        <template #actions>
          <NmorphButton
            class="message-attachment-draft-list__remove"
            shape="circle"
            design="plain"
            borderless
            :aria-label="props.removeAriaLabel"
            @click.stop="emit('remove', attachment)"
          >
            <template #icon-only>
              <NmorphIcon color="var(--nmorph-contrast-text-color)">
                <NmorphIconClose />
              </NmorphIcon>
            </template>
          </NmorphButton>
        </template>
      </NmorphFileCard>
    </div>
  </NmorphScroll>
</template>

<style lang="scss" scoped>
.message-attachment-draft-list {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
}

.message-attachment-draft-list__item {
  flex: 0 0 auto;
}

.message-attachment-draft-list__remove {
  color: var(--nmorph-contrast-text-color);
  background: var(--app-shadow-dark);
}
</style>
