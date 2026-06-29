<script setup lang="ts">
import {
  NmorphText,
  NmorphBadge,
  NmorphCard,
  NmorphIcon,
  NmorphIconMuteNotification,
  NmorphIconPin
} from '@nmorph/nmorph-ui-kit'
import { toRef } from 'vue'
import { RouterLink } from 'vue-router'

import { ChatRoomContextMenu } from 'src/features/chat-room-context-menu'
import { ChatRoomTypingStatus } from 'src/features/chat-room-typing'
import { AppProfileBasicData } from 'src/shared/ui'

import type { ChatRoomListItemProps } from '../config/types'
import { useChatRoomListItem } from '../model/use-chat-room-list-item.model'

const props = defineProps<ChatRoomListItemProps>()
const item = toRef(props, 'item')
const { avatarIcon, avatarIconColor, avatarIconSize, contextMenuActionOptions, isPressed } = useChatRoomListItem(item)
</script>

<template>
  <NmorphCard
    tag="div"
    class="chat-room-list-item"
    content-class="chat-room-list-item__content"
    :shadow-type="isPressed ? 'inset' : 'outset'"
  >
    <RouterLink
      class="chat-room-list-item__link"
      :to="props.item.to"
      :aria-current="props.item.selected ? 'page' : undefined"
    >
      <AppProfileBasicData
        :avatar-icon="avatarIcon"
        :avatar-icon-color="avatarIconColor"
        :avatar-icon-size="avatarIconSize"
        :image-id="props.item.imageId"
        :title="props.item.title"
        :name="props.item.title"
        :show-online="props.item.online"
      >
        <template #title>
          <div class="chat-room-list-item__title">
            <div class="chat-room-list-item__name">
              <NmorphText truncate>{{ props.item.title }}</NmorphText>
            </div>
          </div>
        </template>
        <template #description>
          <ChatRoomTypingStatus :room-id="props.item.id" truncate>
            <NmorphText v-if="props.item.description" as="p" truncate color="semi-contrast" variant="body-small">{{
              props.item.description
            }}</NmorphText>
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
        color="var(--nmorph-warn-text-color)"
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
        color="var(--nmorph-warn-text-color)"
        type="tag"
      />
    </div>
    <ChatRoomContextMenu
      v-if="!props.item.isSupportRoom"
      :item="props.item"
      :action-options="contextMenuActionOptions"
    />
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

.chat-room-list-item__link {
  display: block;
  min-width: 0;
}

.chat-room-list-item__title {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
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
