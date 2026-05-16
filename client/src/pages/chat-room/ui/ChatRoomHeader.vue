<script setup lang="ts">
import { toRef } from 'vue'

import { AppProfileBasicData, AppText } from 'src/shared/ui'

import { CHAT_ROOM_PAGE_I18N } from '../config/constants'
import type { IChatRoomHeaderProps } from '../config/types'
import { useChatRoomHeader } from '../model/use-chat-room-header.model'

const props = defineProps<IChatRoomHeaderProps>()
const room = toRef(props, 'room')
const { title, typingContactNames } = useChatRoomHeader(room)
</script>

<template>
  <header class="chat-room-content-header">
    <AppProfileBasicData
      class="chat-room-content-header__profile"
      :image-id="props.room.avatarId"
      :title="title"
      :name="title"
      :selectable="false"
    >
      <template #description>
        <AppText
          v-if="typingContactNames.length"
          tag="small"
          color="accent"
          :selectable="false"
          :text="`${typingContactNames.join(', ')} ${$t(CHAT_ROOM_PAGE_I18N.typing)}...`"
        />
      </template>
    </AppProfileBasicData>
  </header>
</template>
