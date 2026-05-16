<script setup lang="ts">
import { useChatRoomPage } from '../model/use-chat-room-page.model'

import ChatRoomMessages from './ChatRoomMessages.vue'
import ChatRoomStub from './ChatRoomStub.vue'

const { selectedChatRoom } = useChatRoomPage()
</script>

<template>
  <section class="chat-room-page">
    <ChatRoomMessages v-if="selectedChatRoom" :room="selectedChatRoom" />
    <ChatRoomStub v-else />
  </section>
</template>

<style lang="scss">
.chat-room-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
</style>
