<script setup lang="ts">
import {
  NmorphText,
  NmorphButton,
  NmorphIcon,
  NmorphIconArrowDown,
  NmorphProgress,
  NmorphScroll
} from '@nmorph/nmorph-ui-kit'

import { MESSAGE_LOADING_PROGRESS_PERCENTAGE } from '../config/constants'
import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { ChatRoomMessagesEmits, ChatRoomMessagesProps } from '../config/types'
import { useChatRoomMessages } from '../model/use-chat-room-messages.model'

import DateSeparator from './DateSeparator.vue'
import MessageBody from './MessageBody.vue'

const props = defineProps<ChatRoomMessagesProps>()
const emit = defineEmits<ChatRoomMessagesEmits>()
const {
  hasMessages,
  isInitialMessagesRendering,
  messageRemovalOverlayItems,
  registerMessageListItemElement,
  messageVirtualListStyle,
  messageVirtualListItems,
  saveMessagesScrollState,
  scrollMessagesToBottom,
  showMessagesLoadingProgress,
  showInitialMessagesLoading,
  showBackToBottomButton
} = useChatRoomMessages(props, () => emit('target-message-scrolled'))
</script>

<template>
  <div class="chat-room-messages">
    <div v-if="showMessagesLoadingProgress" class="chat-room-messages__loading-progress">
      <NmorphProgress
        class="chat-room-messages__loading-progress-line"
        :percentage="MESSAGE_LOADING_PROGRESS_PERCENTAGE"
        :height="4"
        :value-right-side="false"
        indeterminate
      />
    </div>
    <NmorphScroll
      ref="messagesScroll"
      class="chat-room-messages__scroll"
      :class="{ 'chat-room-messages__scroll--initial-rendering': isInitialMessagesRendering }"
      :aria-busy="isInitialMessagesRendering"
      scroll-x-prop="hidden"
      css-scroll-behavior="auto"
      update-only-on-scroll-end
      :y-gap-in-px="4"
      @update:model-value="saveMessagesScrollState"
    >
      <div v-if="messageVirtualListItems.length" class="chat-room-messages__virtual" :style="messageVirtualListStyle">
        <div
          v-for="{ item, virtualItem } in messageVirtualListItems"
          :key="item.id"
          :ref="(element) => registerMessageListItemElement(element, item)"
          :data-index="virtualItem.index"
        >
          <div v-if="item.type === 'message-gap'" class="chat-room-messages__gap" />
          <DateSeparator v-else-if="item.type === 'date-separator'" :label="item.label" />
          <div
            v-else
            class="chat-room-messages__message"
            :class="{ 'chat-room-messages__message--self': item.message.isSelf }"
          >
            <MessageBody
              :message="item.message"
              :is-private-room="props.isPrivateRoom"
              :room="props.room"
              @select-message="emit('select-message', $event)"
            />
          </div>
        </div>
      </div>
      <div v-if="hasMessages" ref="messagesBottom" class="chat-room-messages__bottom" />
      <div v-if="showInitialMessagesLoading" class="chat-room-messages__empty">
        <NmorphText align="center">{{ $t(CHAT_ROOM_CONTENT_I18N.loadingMessages) }}</NmorphText>
      </div>
      <div v-else-if="!hasMessages" class="chat-room-messages__empty">
        <NmorphText align="center">{{ $t(CHAT_ROOM_CONTENT_I18N.noMessages) }}</NmorphText>
      </div>
    </NmorphScroll>
    <div v-if="messageRemovalOverlayItems.length" class="chat-room-messages__removal-layer">
      <div
        v-for="overlayItem in messageRemovalOverlayItems"
        :key="overlayItem.id"
        class="chat-room-messages__removal-item"
        :class="{ 'chat-room-messages__removal-item--leaving': overlayItem.isLeaving }"
        :style="overlayItem.style"
      >
        <div
          class="chat-room-messages__message"
          :class="{ 'chat-room-messages__message--self': overlayItem.message.isSelf }"
        >
          <MessageBody
            :message="overlayItem.message"
            :is-private-room="props.isPrivateRoom"
            :room="props.room"
            @select-message="emit('select-message', $event)"
          />
        </div>
      </div>
    </div>
    <NmorphButton
      v-if="showBackToBottomButton"
      class="chat-room-messages__back-to-bottom"
      shape="circle"
      design="plain"
      borderless
      :aria-label="$t(CHAT_ROOM_CONTENT_I18N.backToBottom)"
      @click="scrollMessagesToBottom"
    >
      <template #icon-only>
        <NmorphIcon>
          <NmorphIconArrowDown />
        </NmorphIcon>
      </template>
    </NmorphButton>
  </div>
</template>

<style lang="scss" scoped>
.chat-room-messages {
  position: relative;
  height: 100%;
  min-height: 0;
}

.chat-room-messages__back-to-bottom {
  position: absolute;
  z-index: 1;
  right: 16px;
  bottom: 16px;

  border-radius: 4px;

  background: var(--nmorph-overlay-color);
}

.chat-room-messages__empty {
  @include flex-column-center;
  @include absolute-center;

  gap: 8px;
}

.chat-room-messages__loading-progress {
  position: absolute;
  z-index: 2;
  top: -8px;
  right: -8px;
  left: -8px;

  animation: chat-room-messages-loading-progress-glow 1.6s ease-in-out infinite;
}

.chat-room-messages__loading-progress-line {
  width: 100%;
}

.chat-room-messages__scroll,
.chat-room-messages__scroll * {
  overflow-anchor: none;
}

.chat-room-messages__scroll--initial-rendering {
  pointer-events: none;
  visibility: hidden;
}

.chat-room-messages__virtual {
  display: grid;
  gap: var(--message-virtual-gap);
}

.chat-room-messages__gap {
  height: var(--message-range-gap-height);
}

.chat-room-messages__bottom {
  height: 1px;
}

.chat-room-messages__message {
  display: flex;
  justify-content: flex-start;
}

.chat-room-messages__message--self {
  justify-content: flex-end;
}

.chat-room-messages__removal-layer {
  pointer-events: none;
  position: fixed;
  z-index: 4;
  inset: 0;
}

.chat-room-messages__removal-item {
  position: absolute;
  transform-origin: center;
  transform: translateY(0) scale(1);

  opacity: 1;

  transition: opacity 340ms ease, transform 340ms cubic-bezier(0.16, 1, 0.3, 1);
}

.chat-room-messages__removal-item--leaving {
  transform: translateY(-10px) scale(0.94);
  opacity: 0;
}

@keyframes chat-room-messages-loading-progress-glow {
  0%,
  100% {
    opacity: 0.86;
    filter: drop-shadow(0 0 2px color-mix(in srgb, var(--nmorph-accent-color) 42%, transparent));
  }

  50% {
    opacity: 1;
    filter: drop-shadow(0 0 7px color-mix(in srgb, var(--nmorph-accent-color) 78%, transparent));
  }
}
</style>
