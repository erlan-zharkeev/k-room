<script setup lang="ts">
import { NmorphBadge, NmorphCard, NmorphIcon, NmorphIconMuteNotification, NmorphIconPin } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { ChatRoomContextMenu } from 'src/features/chat-room-context-menu'
import { ChatRoomTypingStatus } from 'src/features/chat-room-typing'
import { AppProfileBasicData, AppText } from 'src/shared/ui'

import { useScreen } from '../../../shared/lib'
import type { ChatRoomListItemProps } from '../config/types'

const props = defineProps<ChatRoomListItemProps>()
const { isPortraitTabletOrLess } = useScreen()
const isPressed = computed(() => props.item.selected && !isPortraitTabletOrLess.value)
</script>

<template>
  <NmorphBadge
    class="chat-room-list-item-badge"
    :value="props.item.unreadMessagesQuantity"
    hide-on-falsy-value
    size="tiny"
    color="var(--nmorph-warn-color)"
    type="ribbon"
    ribbon-corner="bottom-left"
  >
    <NmorphCard
      tag="div"
      class="chat-room-list-item"
      content-class="chat-room-list-item__content"
      :shadow-type="isPressed ? 'inset' : 'outset'"
    >
      <div v-if="props.item.isPinned || props.item.isMuted" class="chat-room-list-item__status-icons">
        <NmorphIcon
          v-if="props.item.isMuted"
          class="chat-room-list-item__status-icon"
          color="var(--nmorph-accent-color)"
          aria-hidden="true"
        >
          <NmorphIconMuteNotification />
        </NmorphIcon>
        <NmorphIcon
          v-if="props.item.isPinned"
          class="chat-room-list-item__status-icon chat-room-list-item__pin"
          color="var(--nmorph-accent-color)"
          aria-hidden="true"
        >
          <NmorphIconPin />
        </NmorphIcon>
      </div>
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
      <ChatRoomContextMenu :item="props.item" />
    </NmorphCard>
  </NmorphBadge>
</template>

<style lang="scss">
.chat-room-list-item__content {
  position: relative;

  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 8px;
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
  position: absolute;
  top: -8px;
  right: -8px;

  display: flex;
  gap: 2px;
  align-items: center;
  justify-content: center;
}

.chat-room-list-item__status-icon {
  width: 24px;
  height: 24px;
}

.chat-room-list-item__pin {
  cursor: grab;
}

.chat-room-list-item-badge.nmorph-badge {
  --nmorph-badge-ribbon-corner-size: 20px;
}
</style>
