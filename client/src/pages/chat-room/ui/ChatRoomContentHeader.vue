<script setup lang="ts">
import { AppProfileBasicData, AppText } from 'src/shared/ui'

import { CHAT_ROOM_PAGE_I18N } from '../config/constants'
import { useChatRoomHeader } from '../model/use-chat-room-header.model'
import { useChatRoomPage } from '../model/use-chat-room-page.model'

const { selectedChatRoom } = useChatRoomPage()
const { title, avatarShape, typingContactNames } = useChatRoomHeader(selectedChatRoom)
</script>

<template>
  <header v-if="selectedChatRoom" class="chat-room-content-header">
    <AppProfileBasicData
      class="chat-room-content-header__profile"
      :avatar-shape="avatarShape"
      :image-id="selectedChatRoom.avatarId"
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
