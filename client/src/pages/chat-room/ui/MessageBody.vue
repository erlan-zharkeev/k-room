<script setup lang="ts">
import { NmorphImagePreview } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import type { MessageBodyProps } from '../config/types'
import { useMessageBody } from '../model/use-message-body.model'

const props = defineProps<MessageBodyProps>()
const { showAuthorNickname, messageImageList, sentAt, reactionList } = useMessageBody(props)
</script>

<template>
  <article
    class="message-body"
    :class="[
      props.message.isSelf ? 'message-body--self' : 'message-body--interlocutor',
      props.message.status ? `message-body--${props.message.status}` : ''
    ]"
  >
    <div class="message-body__content">
      <AppText
        v-if="showAuthorNickname"
        class="message-body__author"
        color="accent"
        :text="props.message.authorNickname"
      />
      <div v-if="props.message.repliedMessage" class="message-body__reply">
        <AppText color="accent" :text="props.message.repliedMessage.authorNickname" truncate />
        <AppText
          class="message-body__reply-text"
          tag="small"
          color="semi-contrast-text"
          :text="props.message.repliedMessage.body"
        />
      </div>
      <div v-if="messageImageList.length" class="message-body__images">
        <NmorphImagePreview
          v-for="image in messageImageList"
          :key="image.name"
          class="message-body__image"
          :src="image.previewSrc"
          :alt="image.name"
          width="100%"
          height="220px"
        />
      </div>
      <AppText tag="p" :text="props.message.body" />
      <div class="message-body__footer">
        <div v-if="reactionList.length" class="message-body__reactions">
          <span
            v-for="reaction in reactionList"
            :key="reaction.glyphKey"
            class="message-body__reaction"
            :title="reaction.nicknames.join(', ')"
          >
            {{ reaction.glyphKey }}
          </span>
        </div>
        <AppText v-if="sentAt" tag="small" color="semi-contrast-text" :text="sentAt" />
      </div>
    </div>
  </article>
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

.message-body__reply {
  display: grid;
  margin-bottom: 8px;
  padding-left: 8px;
  border-left: 2px solid var(--nmorph-accent-color);
}

.message-body__reply-text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
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
