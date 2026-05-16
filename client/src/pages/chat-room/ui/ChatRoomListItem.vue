<script setup lang="ts">
import { NmorphBadge, NmorphCard } from '@nmorph/nmorph-ui-kit'
import { RouterLink } from 'vue-router'

import { AppProfileBasicData, AppText } from 'src/shared/ui'

import type { IChatRoomListItemProps } from '../config/types'

const props = defineProps<IChatRoomListItemProps>()
</script>

<template>
  <RouterLink custom :to="props.item.to" v-slot="{ href, navigate }">
    <NmorphCard
      tag="a"
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
      >
        <template #title>
          <div class="chat-room-list-item__title">
            <AppText truncate :selectable="false" :text="props.item.title" />
            <span v-if="props.item.online" class="chat-room-list-item__online" aria-hidden="true" />
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
      <NmorphBadge
        v-if="props.item.unreadMessagesQuantity"
        :value="props.item.unreadMessagesQuantity"
        size="tiny"
        color="var(--nmorph-accent-color)"
      />
    </NmorphCard>
  </RouterLink>
</template>
