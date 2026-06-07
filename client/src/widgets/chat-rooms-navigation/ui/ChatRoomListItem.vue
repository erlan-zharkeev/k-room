<script setup lang="ts">
import { NmorphBadge, NmorphCard, NmorphIcon, NmorphIconMuteNotification, NmorphIconPin } from '@nmorph/nmorph-ui-kit'
import { toRef } from 'vue'
import { RouterLink } from 'vue-router'

import { ChatRoomContextMenu } from 'src/features/chat-room-context-menu'
import { ChatRoomTypingStatus } from 'src/features/chat-room-typing'
import { AppProfileBasicData, AppText } from 'src/shared/ui'

import type { ChatRoomListItemProps } from '../config/types'
import { useChatRoomListItem } from '../model/use-chat-room-list-item.model'

const props = defineProps<ChatRoomListItemProps>()
const item = toRef(props, 'item')
const { contextMenuActionOptions, isPressed } = useChatRoomListItem(item)
</script>

<template>
  <NmorphCard
    tag="div"
    class="chat-room-list-item"
    content-class="chat-room-list-item__content"
    :shadow-type="isPressed ? 'inset' : 'outset'"
  >
    <RouterLink :to="props.item.to" :aria-current="props.item.selected ? 'page' : undefined">
      <AppProfileBasicData
        :image-id="props.item.imageId"
        :title="props.item.title"
        :name="props.item.title"
        :show-online="props.item.online"
      >
        <template #title>
          <div class="chat-room-list-item__title">
            <div class="chat-room-list-item__name">
              <AppText truncate :selectable="false" :text="props.item.title" />
            </div>
          </div>
        </template>
        <template #description>
          <ChatRoomTypingStatus :room-id="props.item.id" truncate>
            <AppText
              v-if="props.item.description"
              tag="small"
              truncate
              color="semi-contrast-text"
              :selectable="false"
              :text="props.item.description"
            />
          </ChatRoomTypingStatus>
        </template>
      </AppProfileBasicData>
    </RouterLink>
    <div v-if="props.item.isMuted || props.item.unreadMessagesQuantity" class="chat-room-list-item__status-icons">
      <NmorphBadge
        v-if="props.item.isMuted"
        class="chat-room-list-item__mute"
        :value="''"
        size="tiny"
        color="var(--nmorph-warn-color)"
        type="tag"
      >
        <template #value>
          <NmorphIcon class="chat-room-list-item__mute-icon" aria-hidden="true" width="12px">
            <NmorphIconMuteNotification />
          </NmorphIcon>
        </template>
      </NmorphBadge>
      <NmorphBadge
        v-if="props.item.unreadMessagesQuantity"
        class="chat-room-list-item__unread"
        :value="props.item.unreadMessagesQuantity"
        size="tiny"
        color="var(--nmorph-warn-color)"
        type="tag"
      />
    </div>
    <ChatRoomContextMenu :item="props.item" :action-options="contextMenuActionOptions" />
    <NmorphBadge
      v-if="props.item.isPinned"
      class="chat-room-list-item__pin"
      :value="''"
      size="tiny"
      color="var(--nmorph-accent-color)"
      type="tag"
      aria-hidden="true"
    >
      <template #value>
        <NmorphIcon class="chat-room-list-item__pin-icon" color="var(--nmorph-contrast-text-color)" width="12px">
          <NmorphIconPin />
        </NmorphIcon>
      </template>
    </NmorphBadge>
  </NmorphCard>
</template>

<style lang="scss">
.chat-room-list-item__content {
  position: relative;

  display: grid;
  grid-template-columns: minmax(0, 1fr) auto max-content;
  gap: 4px;
  align-items: center;

  padding-right: 4px;
}

.chat-room-list-item__title {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chat-room-list-item__name {
  display: flex;
  flex: 1 1 auto;
  gap: 6px;
  align-items: center;

  min-width: 0;
}

.chat-room-list-item__status-icons {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
}

.chat-room-list-item__pin.nmorph-badge.nmorph-badge--tag {
  cursor: grab;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
