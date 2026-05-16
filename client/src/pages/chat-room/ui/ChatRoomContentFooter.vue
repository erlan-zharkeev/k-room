<script setup lang="ts">
import { NmorphButton, NmorphCard, NmorphIconArrowUp, NmorphTextInput } from '@nmorph/nmorph-ui-kit'

import { CHAT_ROOM_PAGE_I18N } from '../config/constants'
import { useChatRoomComposer } from '../model/use-chat-room-composer.model'
import { useChatRoomPage } from '../model/use-chat-room-page.model'

const { selectedChatRoom } = useChatRoomPage()
const { messageText, isSendDisabled, sendMessage } = useChatRoomComposer()
</script>

<template>
  <NmorphCard v-if="selectedChatRoom" tag="footer" class="chat-room-content-footer" shadow-type="combined">
    <NmorphTextInput
      v-model="messageText"
      :placeholder="$t(CHAT_ROOM_PAGE_I18N.messagePlaceholder)"
      :input-attrs="{ 'aria-label': $t(CHAT_ROOM_PAGE_I18N.messagePlaceholder) }"
      @keydown.enter.prevent="sendMessage(selectedChatRoom.id)"
    />
    <NmorphButton
      shape="square"
      :disabled="isSendDisabled"
      :aria-label="$t(CHAT_ROOM_PAGE_I18N.sendMessage)"
      @click="sendMessage(selectedChatRoom.id)"
    >
      <template #icon>
        <NmorphIconArrowUp />
      </template>
    </NmorphButton>
  </NmorphCard>
</template>

<style lang="scss">
.chat-room-content-footer {
  .nmorph-card__content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) max-content;
    flex: 0 0 auto;
    gap: 8px;
  }
}
</style>
