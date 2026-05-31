<script setup lang="ts">
import { NmorphImagePreview } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { MESSAGE_IMAGE_PREVIEW_HEIGHT_PX } from '../config/constants'
import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageBodyEmits, MessageBodyProps } from '../config/types'
import { useMessageBody } from '../model/use-message-body.model'
import { useMessageReferencePreview } from '../model/use-message-reference-preview.model'

import MessageAudioList from './MessageAudioList.vue'
import MessageContextMenu from './MessageContextMenu.vue'
import MessageDocumentList from './MessageDocumentList.vue'
import MessageLinkPreview from './MessageLinkPreview.vue'
import MessagePreview from './MessagePreview.vue'
import MessageReactions from './MessageReactions.vue'
import MessageStatusDots from './MessageStatusDots.vue'
import MessageText from './MessageText.vue'
import MessageVideoList from './MessageVideoList.vue'

const props = defineProps<MessageBodyProps>()
const emit = defineEmits<MessageBodyEmits>()
const {
  showAuthorNickname,
  isMessageEditing,
  hasMessageBody,
  hasMessageImages,
  messageAudios,
  messageDocuments,
  messageVideos,
  messageImagePreviewUrlList,
  sentAt
} = useMessageBody(props)
const {
  messageReference,
  canSelectMessageReference,
  messageReferencePreviewText,
  messageReferencePreviewTitle,
  selectMessageReference
} = useMessageReferencePreview(props, (selection) => emit('select-message', selection))
</script>

<template>
  <MessageContextMenu :message="props.message" :room="props.room">
    <article
      class="message-body"
      :class="[
        props.message.isSelf && 'message-body--self',
        props.message.status && `message-body--${props.message.status}`,
        isMessageEditing && 'message-body--editing'
      ]"
    >
      <div class="message-body__content">
        <AppText v-if="showAuthorNickname" color="accent" :text="props.message.authorNickname" />
        <button
          v-if="messageReference && canSelectMessageReference"
          type="button"
          class="message-body__reference-preview message-body__reference-preview--button"
          @click.stop="selectMessageReference"
        >
          <MessagePreview :title="messageReferencePreviewTitle" :text="messageReferencePreviewText" />
        </button>
        <div v-else-if="messageReference" class="message-body__reference-preview">
          <MessagePreview :title="messageReferencePreviewTitle" :text="messageReferencePreviewText" />
        </div>
        <div
          v-if="hasMessageImages"
          class="message-body__images"
          :style="{ minHeight: `${MESSAGE_IMAGE_PREVIEW_HEIGHT_PX}px` }"
        >
          <NmorphImagePreview
            v-if="messageImagePreviewUrlList.length"
            :src="messageImagePreviewUrlList"
            width="100%"
            :height="`${MESSAGE_IMAGE_PREVIEW_HEIGHT_PX}px`"
            radius="4px"
            trigger-view="gallery"
            trigger-gap="6px"
          />
        </div>
        <MessageVideoList :videos="messageVideos" />
        <MessageDocumentList :documents="messageDocuments" />
        <MessageAudioList :audios="messageAudios" />
        <MessageText v-if="hasMessageBody" :text="props.message.body" />
        <MessageLinkPreview v-if="props.message.linkPreview" :preview="props.message.linkPreview" />
        <div class="message-body__footer">
          <MessageReactions :message="props.message" :room="props.room" />
          <AppText v-if="props.message.editedAt" tag="small" italic :text="$t(CHAT_ROOM_CONTENT_I18N.editedMessage)" />
          <AppText v-if="sentAt" tag="small" color="semi-contrast-text" :text="sentAt" />
          <MessageStatusDots :message="props.message" />
        </div>
      </div>
    </article>
  </MessageContextMenu>
</template>

<style lang="scss">
.message-body {
  position: relative;

  overflow: hidden;
  display: grid;
  gap: 4px;

  max-width: min(72%, 620px);
  padding: 8px 12px;
  border-radius: 8px;

  overflow-wrap: anywhere;

  background: var(--app-message-surface);
}

@include screen-tablet {
  .message-body {
    max-width: 86%;
  }
}

.message-body--self {
  background: var(--nmorph-dark-shade-color);
}

.message-body--editing {
  outline: 2px solid var(--nmorph-accent-color);
  outline-offset: 2px;
}

.message-body--sending {
  pointer-events: none;
  border: 1.5px solid var(--app-accent-border-soft);
  opacity: 0.5;
  animation: message-body-sending-pulse 1.8s ease-in-out infinite;
}

.message-body--sending .message-body__content {
  filter: grayscale(1);
}

@keyframes message-body-sending-pulse {
  50% {
    border-color: var(--app-accent-border-strong);
    background: var(--app-accent-on-dark-surface-soft);
    box-shadow: 0 0 0 3px var(--app-accent-surface-subtle);
  }
}

.message-body__content {
  display: grid;
  gap: 4px;
}

.message-body__reference-preview {
  padding: 0;
  color: inherit;
  text-align: left;
}

.message-body__reference-preview--button {
  cursor: pointer;
  border: 0;
}

.message-body__images .nmorph-image-preview.nmorph-image-preview--gallery-trigger .nmorph-image-preview__trigger {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
}

.message-body__footer {
  display: flex;
  gap: 8px;
  align-items: baseline;
  justify-content: flex-end;
}
</style>
