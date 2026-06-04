<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'

import { useChatRoomContent } from '../model/use-chat-room-content.model'

import ChatRoomFooter from './ChatRoomFooter.vue'
import ChatRoomHeader from './ChatRoomHeader.vue'
import ChatRoomMessages from './ChatRoomMessages.vue'
import ChatRoomPinnedMessage from './ChatRoomPinnedMessage.vue'
import ChatRoomStub from './ChatRoomStub.vue'

const {
  selectedChatRoom,
  isSelectedChatRoomPrivate,
  selectedMessageId,
  joinableSelectedRoomCall,
  isRoomCallStartDisabled,
  isStartingRoomCall,
  isJoiningRoomCall,
  isRoomCallJoinDisabled,
  clearSelectedMessage,
  selectChatRoomMessage,
  selectCurrentChatRoomMessage,
  joinSelectedRoomCall,
  startSelectedRoomCall
} = useChatRoomContent()
</script>

<template>
  <section class="chat-room-page">
    <ChatRoomHeader
      v-if="selectedChatRoom"
      :room="selectedChatRoom"
      :is-private-room="isSelectedChatRoomPrivate"
      :joinable-room-call="joinableSelectedRoomCall"
      :is-room-call-start-disabled="isRoomCallStartDisabled"
      :is-room-call-join-disabled="isRoomCallJoinDisabled"
      :is-room-call-starting="isStartingRoomCall"
      :is-room-call-joining="isJoiningRoomCall"
      @start-room-call="startSelectedRoomCall"
      @join-room-call="joinSelectedRoomCall"
    />
    <template v-if="selectedChatRoom">
      <ChatRoomPinnedMessage :room="selectedChatRoom" @select="selectCurrentChatRoomMessage" />
      <NmorphCard shadow-type="inset" class="chat-room-page__messages">
        <ChatRoomMessages
          :key="selectedChatRoom.id"
          :room="selectedChatRoom"
          :is-private-room="isSelectedChatRoomPrivate"
          :target-message-id="selectedMessageId"
          @select-message="selectChatRoomMessage"
          @target-message-scrolled="clearSelectedMessage"
        />
      </NmorphCard>
      <ChatRoomFooter :room="selectedChatRoom" @select-editing-message="selectCurrentChatRoomMessage" />
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
