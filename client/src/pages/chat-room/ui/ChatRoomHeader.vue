<script setup lang="ts">
import { toRef } from 'vue'

import { ChatRoomTypingStatus } from 'src/features/chat-room-typing'
import { AppProfileBasicData } from 'src/shared/ui'

import type { ChatRoomHeaderProps } from '../config/types'
import { useChatRoomHeader } from '../model/use-chat-room-header.model'

const props = defineProps<ChatRoomHeaderProps>()
const room = toRef(props, 'room')
const { title } = useChatRoomHeader(room, props.isPrivateRoom)
</script>

<template>
  <header class="chat-room-content-header">
    <AppProfileBasicData :image-id="props.room.avatarId" :title="title" :name="title" :selectable="false">
      <template #description>
        <ChatRoomTypingStatus :room-id="props.room.id" />
      </template>
    </AppProfileBasicData>
  </header>
</template>
