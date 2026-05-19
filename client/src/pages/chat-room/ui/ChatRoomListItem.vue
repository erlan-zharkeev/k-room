<script setup lang="ts">
import { NmorphBadge, NmorphCard } from '@nmorph/nmorph-ui-kit'
import { RouterLink } from 'vue-router'

import { AppProfileBasicData, AppText } from 'src/shared/ui'

import type { IChatRoomListItemProps } from '../config/types'

const props = defineProps<IChatRoomListItemProps>()
</script>

<template>
  <RouterLink custom :to="props.item.to" v-slot="{ href, navigate }">
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
        tag="a"
        class="chat-room-list-item"
        :href="href"
        @click="navigate"
        :shadow-type="props.item.selected ? 'inset' : 'outset'"
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
      </NmorphCard>
    </NmorphBadge>
  </RouterLink>
</template>

<style lang="scss">
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
  --nmorph-badge-ribbon-corner-size: 20px
}
</style>
