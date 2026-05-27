<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'

import { useChatRoomContent } from '../model/use-chat-room-content.model'

import ChatRoomFooter from './ChatRoomFooter.vue'
import ChatRoomHeader from './ChatRoomHeader.vue'
import ChatRoomMessages from './ChatRoomMessages.vue'
import ChatRoomPinnedMessage from './ChatRoomPinnedMessage.vue'
import ChatRoomStub from './ChatRoomStub.vue'

const { selectMessage, selectedChatRoom, selectedChatRoomIsPrivate } = useChatRoomContent()
</script>

<template>
  <section class="chat-room-page">
    <ChatRoomHeader v-if="selectedChatRoom" :room="selectedChatRoom" :is-private-room="selectedChatRoomIsPrivate" />
    <template v-if="selectedChatRoom">
      <ChatRoomPinnedMessage :room="selectedChatRoom" @select="selectMessage" />
      <NmorphCard shadow-type="inset" class="chat-room-page__messages">
        <ChatRoomMessages
          :key="selectedChatRoom.id"
          ref="chatRoomMessages"
          :room="selectedChatRoom"
          :is-private-room="selectedChatRoomIsPrivate"
        />
      </NmorphCard>
      <ChatRoomFooter :room="selectedChatRoom" @select-editing-message="selectMessage" />
    </template>
    <NmorphCard v-else shadow-type="inset" class="chat-room-page__stub">
      <ChatRoomStub />
    </NmorphCard>
  </section>
</template>

<style lang="scss">
.chat-room-page {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-room-page__messages,
.chat-room-page__stub {
  flex: 1 1 auto;
  min-height: 0;
}
</style>
