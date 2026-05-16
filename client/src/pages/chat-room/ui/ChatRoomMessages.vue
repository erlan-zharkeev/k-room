<script setup lang="ts">
import { NmorphButton, NmorphScroll } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { MESSAGE_ID_DATA_ATTRIBUTE } from '../config/constants'
import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'
import type { IChatRoomMessagesProps } from '../config/types'
import { useChatRoomMessages } from '../model/use-chat-room-messages.model'

import DateSeparator from './DateSeparator.vue'
import MessageBody from './MessageBody.vue'

const props = defineProps<IChatRoomMessagesProps>()
const { messagesScroll, hasMessages, isLoading, hasMoreMessages, messageList, loadOlderMessages } =
  useChatRoomMessages(props)
</script>

<template>
  <NmorphScroll ref="messagesScroll" class="chat-room-messages" scroll-x-prop="hidden" css-scroll-behavior="auto">
    <NmorphButton
      v-if="hasMoreMessages"
      class="chat-room-messages__load-older"
      style-type="transparent"
      :loading="isLoading"
      :text="$t(CHAT_ROOM_PAGE_I18N.loadOlderMessages)"
      @click="loadOlderMessages"
    />
    <AppText
      v-if="isLoading && !hasMessages"
      alignment="center"
      color="semi-contrast-text"
      :selectable="false"
      :text="$t(CHAT_ROOM_PAGE_I18N.loadingMessages)"
    />
    <AppText
      v-else-if="!hasMessages"
      alignment="center"
      color="semi-contrast-text"
      :selectable="false"
      :text="$t(CHAT_ROOM_PAGE_I18N.noMessages)"
    />
    <template v-for="item in messageList" :key="item.id">
      <DateSeparator v-if="item.type === 'date-separator'" :label="item.label" />
      <div
        v-else
        class="chat-room-messages__message"
        :class="{ 'chat-room-messages__message--self': item.message.isSelf }"
        :[MESSAGE_ID_DATA_ATTRIBUTE]="item.message.id"
      >
        <MessageBody :message="item.message" :is-private-room="props.isPrivateRoom" />
      </div>
    </template>
  </NmorphScroll>
</template>

<style lang="scss">
.chat-room-messages {
  display: grid;
  gap: 4px;
}

.chat-room-messages__load-older {
  justify-self: center;
}

.chat-room-messages__message {
  display: flex;
  justify-content: flex-start;
}

.chat-room-messages__message--self {
  justify-content: flex-end;
}
</style>
