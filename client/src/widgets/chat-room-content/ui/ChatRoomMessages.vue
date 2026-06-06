<script setup lang="ts">
import { NmorphButton, NmorphIcon, NmorphIconArrowDown, NmorphProgress, NmorphScroll } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { MESSAGE_LOADING_PROGRESS_PERCENTAGE } from '../config/constants'
import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { ChatRoomMessagesEmits, ChatRoomMessagesProps } from '../config/types'
import { useChatRoomMessages } from '../model/use-chat-room-messages.model'

import DateSeparator from './DateSeparator.vue'
import MessageBody from './MessageBody.vue'

const props = defineProps<ChatRoomMessagesProps>()
const emit = defineEmits<ChatRoomMessagesEmits>()
const {
  hasLoadedMessages,
  hasMessages,
  isLoading,
  measureMessageListItemElement,
  messageVirtualListStyle,
  messageVirtualListItems,
  saveMessagesScrollState,
  scrollMessagesToBottom,
  showBackToBottomButton
} = useChatRoomMessages(props, () => emit('target-message-scrolled'))
</script>

<template>
  <div class="chat-room-messages">
    <NmorphScroll
      ref="messagesScroll"
      class="chat-room-messages__scroll"
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
          :ref="measureMessageListItemElement"
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
      <div v-if="isLoading && !hasLoadedMessages" class="chat-room-messages__empty">
        <div class="chat-room-messages__loading">
          <AppText alignment="center" :selectable="false" :text="$t(CHAT_ROOM_CONTENT_I18N.loadingMessages)" />
          <NmorphProgress
            class="chat-room-messages__loading-progress"
            :percentage="MESSAGE_LOADING_PROGRESS_PERCENTAGE"
            :height="4"
            :value-right-side="false"
            indeterminate
          />
        </div>
      </div>
      <div v-else-if="!hasMessages" class="chat-room-messages__empty">
        <AppText alignment="center" :selectable="false" :text="$t(CHAT_ROOM_CONTENT_I18N.noMessages)" />
      </div>
    </NmorphScroll>
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

<style lang="scss">
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

.chat-room-messages__loading {
  display: grid;
  gap: 8px;
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
</style>
