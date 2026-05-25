<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'
import { toRef } from 'vue'

import { ChatRoomContextMenu } from 'src/features/chat-room-context-menu'
import { ChatRoomTypingStatus } from 'src/features/chat-room-typing'
import { ContentNavigationBackButton } from 'src/features/content-navigation-back-button'
import { UserActivityStatus } from 'src/features/user-activity-status'
import { AppProfileBasicData, AppText } from 'src/shared/ui'

import type { ChatRoomHeaderProps } from '../config/types'
import { useChatRoomHeader } from '../model/use-chat-room-header.model'

const props = defineProps<ChatRoomHeaderProps>()
const room = toRef(props, 'room')
const { interlocutor, isPortraitTabletOrLess, membersQuantityText, title } = useChatRoomHeader(
  room,
  props.isPrivateRoom
)
</script>
<template>
  <div class="chat-room-header" :class="{ 'chat-room-header--with-back': isPortraitTabletOrLess }">
    <ContentNavigationBackButton v-if="isPortraitTabletOrLess" class="chat-room-header__back" />
    <NmorphCard
      tag="header"
      shadow-type="inset"
      class="chat-room-content-header"
      content-class="chat-room-content-header__content"
    >
      <AppProfileBasicData
        :image-id="props.room.avatarId"
        :avatar-size="41"
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
    </NmorphCard>
  </div>
</template>

<style lang="scss">
.chat-room-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  height: auto;
}

.chat-room-header--with-back {
  grid-template-columns: max-content minmax(0, 1fr);
}

.chat-room-content-header {
  min-width: 0;
}

.chat-room-content-header__content {
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
