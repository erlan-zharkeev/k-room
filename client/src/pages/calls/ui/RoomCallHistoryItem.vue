<script setup lang="ts">
import { NmorphCard, NmorphIcon } from '@nmorph/nmorph-ui-kit'

import { AppProfileBasicData, AppText } from 'src/shared/ui'

import type { RoomCallHistoryItemProps } from '../config/types'

const props = defineProps<RoomCallHistoryItemProps>()
</script>

<template>
  <NmorphCard
    tag="div"
    class="room-call-history-item"
    content-class="room-call-history-item__content"
    :shadow-type="props.item.isActive ? 'inset' : 'outset'"
  >
    <RouterLink :to="props.item.to">
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
              :title="props.item.mediaLabel"
            >
              <component :is="props.item.mediaIcon" />
            </NmorphIcon>
          </div>
        </template>
      </AppProfileBasicData>
    </RouterLink>
    <div class="room-call-history-item__meta">
      <AppText tag="small" color="semi-contrast-text" :text="props.item.timeText" />
      <AppText tag="small" color="semi-contrast-text" :text="props.item.meta" />
    </div>
  </NmorphCard>
</template>

<style lang="scss">
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
