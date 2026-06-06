<script setup lang="ts">
import { NmorphCard, NmorphIcon } from '@nmorph/nmorph-ui-kit'

import { AppProfileBasicData, AppText } from 'src/shared/ui'

import type { RoomCallHistoryItemEmits, RoomCallHistoryItemProps } from '../config/types'
import { useRoomCallHistoryItem } from '../model/use-room-call-history-item.model'

const props = defineProps<RoomCallHistoryItemProps>()
const emit = defineEmits<RoomCallHistoryItemEmits>()
const {
  isRoomCallHistoryItemInteractive,
  roomCallHistoryItemAriaDisabled,
  roomCallHistoryItemRole,
  roomCallHistoryItemTabindex,
  startRoomCallHistoryItem
} = useRoomCallHistoryItem(props, emit)
</script>

<template>
  <NmorphCard
    tag="div"
    class="room-call-history-item"
    :class="{ 'room-call-history-item--interactive': isRoomCallHistoryItemInteractive }"
    content-class="room-call-history-item__content"
    :shadow-type="props.item.isActive ? 'inset' : 'outset'"
    :role="roomCallHistoryItemRole"
    :tabindex="roomCallHistoryItemTabindex"
    :aria-disabled="roomCallHistoryItemAriaDisabled"
    @click="startRoomCallHistoryItem"
    @keydown.enter.prevent="startRoomCallHistoryItem"
    @keydown.space.prevent="startRoomCallHistoryItem"
  >
    <AppProfileBasicData
      :image-id="props.item.imageId"
      :title="props.item.title"
      :name="props.item.title"
      :selectable="false"
    >
      <template #description>
        <div class="room-call-history-item__description">
          <AppText
            class="room-call-history-item__status"
            tag="small"
            truncate
            :style="{ color: props.item.statusColor }"
            :text="props.item.statusText"
          />
          <NmorphIcon
            class="room-call-history-item__media-icon"
            width="14px"
            height="14px"
            :color="props.item.statusColor"
            :aria-label="props.item.mediaLabel"
          >
            <component :is="props.item.mediaIcon" />
          </NmorphIcon>
        </div>
      </template>
    </AppProfileBasicData>
    <div class="room-call-history-item__meta">
      <AppText tag="small" color="semi-contrast-text" :text="props.item.timeText" />
      <AppText tag="small" color="semi-contrast-text" :text="props.item.meta" />
    </div>
  </NmorphCard>
</template>

<style lang="scss">
.room-call-history-item--interactive {
  cursor: pointer;
}

.room-call-history-item__content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 8px;
  align-items: center;
}

.room-call-history-item__description {
  display: flex;
  gap: 4px;
  align-items: center;
}

.room-call-history-item__meta {
  display: grid;
  gap: 2px;
  justify-items: end;
}
</style>
