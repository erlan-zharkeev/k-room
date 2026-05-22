<script setup lang="ts">
import { NmorphBadge, NmorphCard, NmorphIcon, NmorphIconPin } from '@nmorph/nmorph-ui-kit'
import { RouterLink } from 'vue-router'

import { AppProfileBasicData, AppText } from 'src/shared/ui'

import type { ChatRoomListItemProps } from '../config/types'

import ChatRoomContextMenu from './ChatRoomContextMenu.vue'

const props = defineProps<ChatRoomListItemProps>()
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
    <NmorphBadge
      class="chat-room-list-item-pinned-badge"
      :hidden="!props.item.isPinned"
      value="pinned"
      size="tiny"
      color="var(--nmorph-accent-color)"
      type="ribbon"
      ribbon-corner="top-right"
      :ribbon-tilt="false"
    >
      <template #value>
        <NmorphIcon
          class="chat-room-list-item-pinned-badge__icon"
          width="12px"
          color="var(--nmorph-contrast-text-color)"
          aria-hidden="true"
        >
          <NmorphIconPin />
        </NmorphIcon>
      </template>
      <NmorphCard
        tag="div"
        class="chat-room-list-item"
        content-class="chat-room-list-item__content"
        :shadow-type="props.item.selected ? 'inset' : 'outset'"
      >
        <RouterLink
          class="chat-room-list-item__link"
          :to="props.item.to"
          :aria-current="props.item.selected ? 'page' : undefined"
        >
          <AppProfileBasicData
            class="chat-room-list-item__profile"
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
              <AppText
                v-if="props.item.description"
                tag="small"
                truncate
                color="semi-contrast-text"
                :selectable="false"
                :text="props.item.description"
              />
            </template>
          </AppProfileBasicData>
        </RouterLink>
        <div class="chat-room-list-item__actions">
          <ChatRoomContextMenu :item="props.item" />
        </div>
      </NmorphCard>
    </NmorphBadge>
  </NmorphBadge>
</template>

<style lang="scss">
.chat-room-list-item__content {
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

.chat-room-list-item-badge.nmorph-badge {
  --nmorph-badge-ribbon-corner-size: 20px;

  cursor: grab;
}

.chat-room-list-item-pinned-badge.nmorph-badge {
  --nmorph-badge-ribbon-width: 32px;
  --nmorph-badge-ribbon-height: 16px;

  width: 100%;
}
</style>
