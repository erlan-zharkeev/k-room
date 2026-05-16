<script setup lang="ts">
import { NmorphButton, NmorphCard, NmorphIconArrowUp, NmorphTextInput } from '@nmorph/nmorph-ui-kit'

import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'
import type { IChatRoomFooterProps } from '../config/types'
import { useChatRoomFooter } from '../model/use-chat-room-footer.model'

const props = defineProps<IChatRoomFooterProps>()
const { messageText, isSendDisabled, sendMessage } = useChatRoomFooter()
</script>

<template>
  <NmorphCard tag="footer" class="chat-room-content-footer" shadow-type="combined">
    <NmorphTextInput
      v-model="messageText"
      :placeholder="$t(CHAT_ROOM_PAGE_I18N.messagePlaceholder)"
      :input-attrs="{ 'aria-label': $t(CHAT_ROOM_PAGE_I18N.messagePlaceholder) }"
      @keydown.enter.prevent="sendMessage(props.room.id)"
    />
    <NmorphButton
      shape="square"
      :disabled="isSendDisabled"
      :aria-label="$t(CHAT_ROOM_PAGE_I18N.sendMessage)"
      @click="sendMessage(props.room.id)"
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
