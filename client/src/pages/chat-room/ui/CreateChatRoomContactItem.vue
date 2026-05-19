<script setup lang="ts">
import { NmorphAvatar } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import type { ICreateChatRoomContactItemProps } from '../config/types'
import { useCreateChatRoomContactItem } from '../model/use-create-chat-room-contact-item.model'

const props = defineProps<ICreateChatRoomContactItemProps>()
const { avatarSrc } = useCreateChatRoomContactItem(props)
</script>

<template>
  <div class="create-chat-room-contact-item">
    <NmorphAvatar
      class="create-chat-room-contact-item__avatar"
      :src="avatarSrc"
      :alt="props.nickname"
      :size="28"
      shape="square"
    />
    <AppText class="create-chat-room-contact-item__name" truncate :selectable="false" :text="props.nickname" />
  </div>
</template>

<style lang="scss">
.create-chat-room-contact-item {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
