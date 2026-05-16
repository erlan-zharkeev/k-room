<script setup lang="ts">
import type { IChatRoomContentProps } from '../config/types'

import ChatRoomMessages from './ChatRoomMessages.vue'
import ChatRoomStub from './ChatRoomStub.vue'

const props = defineProps<IChatRoomContentProps>()
</script>

<template>
  <section class="chat-room-page">
    <ChatRoomMessages v-if="props.selectedChatRoom" :room="props.selectedChatRoom" />
    <ChatRoomStub v-else />
  </section>
</template>

