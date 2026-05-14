<script setup lang="ts">
import { NmorphBadge, NmorphCard } from '@nmorph/nmorph-ui-kit'

import { AppProfileBasicData, AppText } from 'src/shared/ui'

import type { IChatRoomListItemEmits, IChatRoomListItemProps } from '../config/types'

const props = defineProps<IChatRoomListItemProps>()
const emit = defineEmits<IChatRoomListItemEmits>()
</script>

<template>
  <NmorphCard @click="emit('select', props.item.id)" :shadow-type="props.item.selected ? 'inset' : 'outset'">
    <AppProfileBasicData
      class="chat-room-list-item__profile"
      :avatar-shape="props.item.avatarShape"
      :image-id="props.item.imageId"
      :title="props.item.title"
      :name="props.item.title"
    >
      <template #title>
        <div class="chat-room-list-item__title">
          <AppText truncate :text="props.item.title" />
          <span v-if="props.item.online" class="chat-room-list-item__online" aria-hidden="true" />
        </div>
      </template>
      <template #description>
        <AppText
          v-if="props.item.description"
          tag="small"
          truncate
          color="semi-contrast-text"
          :text="props.item.description"
        />
      </template>
    </AppProfileBasicData>
    <NmorphBadge
      v-if="props.item.unreadMessagesQuantity"
      :value="props.item.unreadMessagesQuantity"
      size="tiny"
      color="var(--nmorph-accent-color)"
    />
  </NmorphCard>
</template>
