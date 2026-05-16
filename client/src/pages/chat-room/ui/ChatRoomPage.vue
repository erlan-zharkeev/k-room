<script setup lang="ts">
import { useChatRoomPage } from '../model/use-chat-room-page.model'

import ChatRoomMessages from './ChatRoomMessages.vue'
import ChatRoomStub from './ChatRoomStub.vue'

const { selectedChatRoom } = useChatRoomPage()
</script>

<template>
  <section class="chat-room-page">
    <div v-if="selectedChatRoom" class="chat-room-page__content">
      <ChatRoomMessages :room="selectedChatRoom" />
    </div>
    <ChatRoomStub v-else />
  </section>
</template>

<style lang="scss">
.chat-room-page {
  height: 100%;
  min-height: 0;
}

.chat-room-page__content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
</style>
