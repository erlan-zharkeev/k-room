<script setup lang="ts">
import { NmorphButton, NmorphScroll } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { ChatRoomMessagesProps } from '../config/types'
import { useChatRoomMessages } from '../model/use-chat-room-messages.model'

import DateSeparator from './DateSeparator.vue'
import MessageBody from './MessageBody.vue'

const props = defineProps<ChatRoomMessagesProps>()
const {
  hasMessages,
  isLoading,
  measureMessageListItemElement,
  messageVirtualListStyle,
  messageVirtualListItems,
  loadMessages
} = useChatRoomMessages(props)
</script>

<template>
  <NmorphScroll ref="messagesScroll" class="chat-room-messages" scroll-x-prop="hidden" css-scroll-behavior="auto">
    <div v-if="messageVirtualListItems.length" class="chat-room-messages__virtual" :style="messageVirtualListStyle">
      <div
        v-for="{ item, virtualItem } in messageVirtualListItems"
        :key="item.id"
        :ref="measureMessageListItemElement"
        :data-index="virtualItem.index"
      >
        <NmorphButton
          v-if="item.type === 'load-older'"
          class="chat-room-messages__load-older"
          style-type="transparent"
          :loading="isLoading"
          :text="$t(CHAT_ROOM_CONTENT_I18N.loadOlderMessages)"
          @click="loadMessages"
        />
        <DateSeparator v-else-if="item.type === 'date-separator'" :label="item.label" />
        <div
          v-else
          class="chat-room-messages__message"
          :class="{ 'chat-room-messages__message--self': item.message.isSelf }"
        >
          <MessageBody :message="item.message" :is-private-room="props.isPrivateRoom" />
        </div>
      </div>
    </div>
    <div v-if="isLoading && !hasMessages" class="chat-room-messages__empty">
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

.chat-room-messages__load-older {
  display: block;
}

.chat-room-messages__message {
  display: flex;
  justify-content: flex-start;
}

.chat-room-messages__message--self {
  justify-content: flex-end;
}
</style>
