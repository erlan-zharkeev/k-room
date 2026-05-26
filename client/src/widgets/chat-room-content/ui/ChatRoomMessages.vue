<script setup lang="ts">
import { NmorphScroll } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { ChatRoomMessagesExpose, ChatRoomMessagesProps } from '../config/types'
import { useChatRoomMessages } from '../model/use-chat-room-messages.model'

import DateSeparator from './DateSeparator.vue'
import MessageBody from './MessageBody.vue'

const props = defineProps<ChatRoomMessagesProps>()
const {
  hasLoadedMessages,
  hasMessages,
  isLoading,
  measureMessageListItemElement,
  messageVirtualListStyle,
  messageVirtualListItems,
  loadAndScrollToMessage,
  saveMessagesScrollState
} = useChatRoomMessages(props)

defineExpose<ChatRoomMessagesExpose>({
  loadAndScrollToMessage
})
</script>

<template>
  <NmorphScroll
    ref="messagesScroll"
    class="chat-room-messages"
    scroll-x-prop="hidden"
    css-scroll-behavior="auto"
    update-only-on-scroll-end
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
          <MessageBody :message="item.message" :is-private-room="props.isPrivateRoom" :room="props.room" />
        </div>
      </div>
    </div>
    <div v-if="isLoading && !hasLoadedMessages" class="chat-room-messages__empty">
      <AppText
        alignment="center"
        color="semi-contrast-text"
        :selectable="false"
        :text="$t(CHAT_ROOM_CONTENT_I18N.loadingMessages)"
      />
    </div>
    <div v-else-if="!hasMessages" class="chat-room-messages__empty">
      <AppText
        alignment="center"
        color="semi-contrast-text"
        :selectable="false"
        :text="$t(CHAT_ROOM_CONTENT_I18N.noMessages)"
      />
    </div>
  </NmorphScroll>
</template>

<style lang="scss">
.chat-room-messages {
  position: relative;
}

.chat-room-messages__empty {
  @include flex-column-center;
  @include absolute-center;

  gap: 8px;
}

.chat-room-messages__virtual {
  display: grid;
  gap: var(--message-virtual-gap);
}

.chat-room-messages__gap {
  height: var(--message-range-gap-height);
}

.chat-room-messages__message {
  display: flex;
  justify-content: flex-start;
}

.chat-room-messages__message--self {
  justify-content: flex-end;
}
</style>
