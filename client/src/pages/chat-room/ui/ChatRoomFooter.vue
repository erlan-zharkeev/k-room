<script setup lang="ts">
import {
  NmorphButton,
  NmorphCard,
  NmorphIconPaperclip,
  NmorphIconSendFilled,
  NmorphTextInput,
  NmorphIconSmile
} from '@nmorph/nmorph-ui-kit'

import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'
import type { IChatRoomFooterProps } from '../config/types'
import { useChatRoomFooter } from '../model/use-chat-room-footer.model'

const props = defineProps<IChatRoomFooterProps>()
const { messageText, isSendDisabled, sendMessage } = useChatRoomFooter()
</script>

<template>
  <NmorphCard tag="footer" class="chat-room-content-footer" shadow-type="combined">
    <NmorphButton shape="square" :aria-label="$t(CHAT_ROOM_PAGE_I18N.attachFile)">
      <template #icon>
        <NmorphIconPaperclip />
      </template>
    </NmorphButton>
    <NmorphTextInput
      v-model="messageText"
      :placeholder="$t(CHAT_ROOM_PAGE_I18N.messagePlaceholder)"
      :input-attrs="{ 'aria-label': $t(CHAT_ROOM_PAGE_I18N.messagePlaceholder) }"
      @keydown.enter.prevent="sendMessage(props.room.id)"
    />
    <NmorphButton shape="square" :aria-label="$t(CHAT_ROOM_PAGE_I18N.selectEmoji)">
      <template #icon>
        <NmorphIconSmile />
      </template>
    </NmorphButton>
    <NmorphButton
      shape="square"
      :disabled="isSendDisabled"
      :aria-label="$t(CHAT_ROOM_PAGE_I18N.sendMessage)"
      @click="sendMessage(props.room.id)"
    >
      <template #icon>
        <NmorphIconSendFilled />
      </template>
    </NmorphButton>
  </NmorphCard>
</template>

<style lang="scss">
.chat-room-content-footer {
  .nmorph-card__content {
    display: flex;
    gap: 8px;
  }
}
</style>
