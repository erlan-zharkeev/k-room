<script setup lang="ts">
import type { IChatRoomContentProps } from '../config/types'

import ChatRoomHeader from './ChatRoomHeader.vue'

const props = defineProps<IChatRoomContentProps>()
</script>

<template>
  <ChatRoomHeader
    v-if="props.selectedChatRoom"
    :room="props.selectedChatRoom"
    :is-private-room="props.selectedChatRoomIsPrivate"
  />
</template>
