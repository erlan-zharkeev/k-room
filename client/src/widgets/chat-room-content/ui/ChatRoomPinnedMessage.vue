<script setup lang="ts">
import { NmorphButton, NmorphIcon, NmorphIconClose, NmorphCard } from '@nmorph/nmorph-ui-kit'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { ChatRoomPinnedMessageEmits, ChatRoomPinnedMessageProps } from '../config/types'
import { useChatRoomPinnedMessage } from '../model/use-chat-room-pinned-message.model'

import MessagePreview from './MessagePreview.vue'

const props = defineProps<ChatRoomPinnedMessageProps>()
const emit = defineEmits<ChatRoomPinnedMessageEmits>()
const { canUpdatePinnedMessage, isUpdatingPinnedMessage, pinnedMessage, pinnedMessageText, unpinPinnedMessage } =
  useChatRoomPinnedMessage(props)
</script>

<template>
  <NmorphCard
    tag="button"
    v-if="pinnedMessage"
    content-class="chat-room-pinned-message"
    shadow-type="inset"
    @click="emit('select', pinnedMessage.id)"
  >
    <MessagePreview
      class="chat-room-pinned-message__preview"
      :title="$t(CHAT_ROOM_CONTENT_I18N.pinnedMessage)"
      :text="pinnedMessageText"
    />
    <NmorphButton
      design="plain"
      borderless
      shape="square"
      thickness="basic"
      :aria-label="$t(CHAT_ROOM_CONTENT_I18N.unpinMessage)"
      :disabled="!canUpdatePinnedMessage"
      :loading="isUpdatingPinnedMessage"
      @click.stop="unpinPinnedMessage"
    >
      <template #icon-only>
        <NmorphIcon>
          <NmorphIconClose />
        </NmorphIcon>
      </template>
    </NmorphButton>
  </NmorphCard>
</template>

<style lang="scss">
.chat-room-pinned-message {
  cursor: pointer;

  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 8px;
  align-items: center;
}

.chat-room-pinned-message__preview {
  justify-items: start;
  text-align: left;
}
</style>
