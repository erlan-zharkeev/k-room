<script setup lang="ts">
import {
  NmorphButton,
  NmorphCard,
  NmorphIconPaperclip,
  NmorphIconSendFilled,
  NmorphTextInput,
  NmorphIconSmile
} from '@nmorph/nmorph-ui-kit'
import { MESSAGE_BODY_MAX_LENGTH } from 'global-shared'
import { toRef } from 'vue'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { ChatRoomFooterProps } from '../config/types'
import { useChatRoomFooter } from '../model/use-chat-room-footer.model'

const props = defineProps<ChatRoomFooterProps>()
const room = toRef(props, 'room')
const { messageText, isSendDisabled, sendMessage } = useChatRoomFooter(room)
</script>

<template>
  <NmorphCard
    tag="footer"
    class="chat-room-content-footer"
    content-class="chat-room-content-footer__content"
    shadow-type="combined"
  >
    <NmorphButton shape="square" :aria-label="$t(CHAT_ROOM_CONTENT_I18N.attachFile)">
      <template #icon>
        <NmorphIconPaperclip />
      </template>
    </NmorphButton>
    <NmorphTextInput
      v-model="messageText"
      :placeholder="$t(CHAT_ROOM_CONTENT_I18N.messagePlaceholder)"
      :input-attrs="{ maxLength: MESSAGE_BODY_MAX_LENGTH, 'aria-label': $t(CHAT_ROOM_CONTENT_I18N.messagePlaceholder) }"
      @keydown.enter.prevent="sendMessage(props.room.id)"
    />
    <NmorphButton shape="square" :aria-label="$t(CHAT_ROOM_CONTENT_I18N.selectEmoji)">
      <template #icon>
        <NmorphIconSmile />
      </template>
    </NmorphButton>
    <NmorphButton
      shape="square"
      :disabled="isSendDisabled"
      :aria-label="$t(CHAT_ROOM_CONTENT_I18N.sendMessage)"
      @click="sendMessage(props.room.id)"
    >
      <template #icon>
        <NmorphIconSendFilled />
      </template>
    </NmorphButton>
  </NmorphCard>
</template>

<style lang="scss">
.chat-room-content-footer__content {
  display: flex;
  gap: 8px;
}
</style>
