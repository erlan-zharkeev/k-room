<script setup lang="ts">
import { toRef } from 'vue'

import { ChatRoomContextMenu } from 'src/features/chat-room-context-menu'
import { ChatRoomTypingStatus } from 'src/features/chat-room-typing'
import { UserActivityStatus } from 'src/features/user-activity-status'
import { AppProfileBasicData, AppText } from 'src/shared/ui'

import type { ChatRoomHeaderProps } from '../config/types'
import { useChatRoomHeader } from '../model/use-chat-room-header.model'

const props = defineProps<ChatRoomHeaderProps>()
const room = toRef(props, 'room')
const { interlocutor, membersQuantityText, title } = useChatRoomHeader(room, props.isPrivateRoom)
</script>

<template>
  <header class="chat-room-content-header">
    <AppProfileBasicData
      :image-id="props.room.avatarId"
      :title="title"
      :name="title"
      :selectable="false"
      class="chat-room-content-header__profile"
    >
      <template #description>
        <ChatRoomTypingStatus :room-id="props.room.id">
          <UserActivityStatus
            v-if="props.isPrivateRoom && interlocutor"
            :online="interlocutor.online"
            :last-seen="interlocutor.lastSeen"
          />
          <AppText
            v-else-if="!props.isPrivateRoom"
            tag="small"
            color="semi-contrast-text"
            :selectable="false"
            :text="membersQuantityText"
          />
        </ChatRoomTypingStatus>
      </template>
    </AppProfileBasicData>

    <ChatRoomContextMenu :item="props.room" />
  </header>
</template>

<style lang="scss">
.chat-room-content-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 8px;
  align-items: center;

  width: 100%;
}

.chat-room-content-header__profile {
  min-width: 0;
}
</style>
