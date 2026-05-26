<script setup lang="ts">
import { AppMediaImage, AppText } from 'src/shared/ui'

import type { MessageBodyProps } from '../config/types'
import { useMessageBody } from '../model/use-message-body.model'

import MessageContextMenu from './MessageContextMenu.vue'
import MessagePreview from './MessagePreview.vue'

const props = defineProps<MessageBodyProps>()
const { showAuthorNickname, messageImageList, sentAt, reactionList } = useMessageBody(props)
</script>

<template>
  <MessageContextMenu :message="props.message" :room="props.room">
    <article
      class="message-body"
      :class="[
        props.message.isSelf && 'message-body--self',
        props.message.status && `message-body--${props.message.status}`
      ]"
    >
      <div class="message-body__content">
        <AppText v-if="showAuthorNickname" color="accent" :text="props.message.authorNickname" />
        <MessagePreview
          v-if="props.message.repliedMessage"
          :title="props.message.repliedMessage.authorNickname"
          :text="props.message.repliedMessage.body"
        />
        <div v-if="messageImageList.length" class="message-body__images">
          <AppMediaImage
            v-for="image in messageImageList"
            :key="image.mediaId"
            :media-id="image.mediaId"
            :alt="image.name"
            width="100%"
            height="220px"
          />
        </div>
        <AppText tag="p" :text="props.message.body" />
        <div class="message-body__footer">
          <template v-if="reactionList.length">
            <span v-for="reaction in reactionList" :key="reaction.glyphKey" :title="reaction.nicknames.join(', ')">
              {{ reaction.glyphKey }}
            </span>
          </template>
          <AppText v-if="sentAt" tag="small" color="semi-contrast-text" :text="sentAt" />
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

  background: color-mix(in srgb, var(--nmorph-dark-shade-color), var(--nmorph-light-shade-color) 20%);
}

@include screen-tablet {
  .message-body {
    max-width: 86%;
  }
}

.message-body--self {
  background: var(--nmorph-dark-shade-color);
}

.message-body--sending {
  pointer-events: none;
  border: 1.5px solid color-mix(in srgb, var(--nmorph-accent-color), transparent 54%);
  opacity: 0.5;
  animation: message-body-sending-pulse 1.8s ease-in-out infinite;
}

.message-body--sending .message-body__content {
  filter: grayscale(1);
}

@keyframes message-body-sending-pulse {
  50% {
    border-color: color-mix(in srgb, var(--nmorph-accent-color), transparent 24%);
    background: color-mix(in srgb, var(--nmorph-dark-shade-color), var(--nmorph-accent-color) 12%);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--nmorph-accent-color), transparent 88%);
  }
}

.message-body__content {
  display: grid;
  gap: 8px;
}

.message-body__images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 6px;
}

.message-body__footer {
  display: flex;
  gap: 8px;
  align-items: baseline;
  justify-content: flex-end;
}
</style>
