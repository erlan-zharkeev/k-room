<script setup lang="ts">
import type { IChatRoomContentProps } from '../config/types'

import ChatRoomFooter from './ChatRoomFooter.vue'

const props = defineProps<IChatRoomContentProps>()
</script>

<template>
  <ChatRoomFooter v-if="props.selectedChatRoom" :room="props.selectedChatRoom" />
</template>
