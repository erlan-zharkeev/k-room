<script setup lang="ts">
import {
  NmorphButton,
  NmorphCard,
  NmorphIconCheck,
  NmorphIconClose,
  NmorphIconPaperclip,
  NmorphIconSendFilled,
  NmorphTextInput,
  NmorphIconSmile
} from '@nmorph/nmorph-ui-kit'
import { MESSAGE_BODY_MAX_LENGTH } from 'global-shared'
import { toRef } from 'vue'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { ChatRoomFooterEmits, ChatRoomFooterProps } from '../config/types'
import { useChatRoomFooter } from '../model/use-chat-room-footer.model'

import MessageImageDraftList from './MessageImageDraftList.vue'
import MessagePreview from './MessagePreview.vue'

const props = defineProps<ChatRoomFooterProps>()
const emit = defineEmits<ChatRoomFooterEmits>()
const room = toRef(props, 'room')
const {
  messageText,
  editingMessagePreviewText,
  editingMessageImages,
  messageEditText,
  isSendDisabled,
  canSubmitMessageEdit,
  isEditingCurrentRoomMessage,
  isUpdatingEditedMessage,
  cancelMessageEdit,
  removeEditingMessageImage,
  selectEditingMessage,
  sendMessage,
  submitMessageEdit
} = useChatRoomFooter(room, (messageId) => emit('select-editing-message', messageId))
</script>

<template>
  <NmorphCard
    tag="footer"
    class="chat-room-content-footer"
    content-class="chat-room-content-footer__content"
    shadow-type="combined"
  >
    <button
      v-if="isEditingCurrentRoomMessage"
      type="button"
      class="chat-room-content-footer__edit-preview"
      @click="selectEditingMessage"
    >
      <MessagePreview :title="$t(CHAT_ROOM_CONTENT_I18N.editingMessage)" :text="editingMessagePreviewText" />
    </button>
    <MessageImageDraftList
      :images="editingMessageImages"
      :remove-aria-label="$t(CHAT_ROOM_CONTENT_I18N.removeMessageImage)"
      @remove="removeEditingMessageImage"
    />
    <div class="chat-room-content-footer__controls">
      <NmorphButton
        v-if="isEditingCurrentRoomMessage"
        shape="square"
        :aria-label="$t(CHAT_ROOM_CONTENT_I18N.cancel)"
        :disabled="isUpdatingEditedMessage"
        @click="cancelMessageEdit"
      >
        <template #icon>
          <NmorphIconClose />
        </template>
      </NmorphButton>
      <NmorphButton v-else shape="square" :aria-label="$t(CHAT_ROOM_CONTENT_I18N.attachFile)">
        <template #icon>
          <NmorphIconPaperclip />
        </template>
      </NmorphButton>
      <NmorphTextInput
        v-if="isEditingCurrentRoomMessage"
        v-model="messageEditText"
        :placeholder="$t(CHAT_ROOM_CONTENT_I18N.editMessage)"
        :input-attrs="{ maxLength: MESSAGE_BODY_MAX_LENGTH, 'aria-label': $t(CHAT_ROOM_CONTENT_I18N.editMessage) }"
        @keydown.enter.prevent="submitMessageEdit"
        @keydown.escape.prevent="cancelMessageEdit"
      />
      <NmorphTextInput
        v-else
        v-model="messageText"
        :placeholder="$t(CHAT_ROOM_CONTENT_I18N.messagePlaceholder)"
        :input-attrs="{
          maxLength: MESSAGE_BODY_MAX_LENGTH,
          'aria-label': $t(CHAT_ROOM_CONTENT_I18N.messagePlaceholder)
        }"
        @keydown.enter.prevent="sendMessage(props.room.id)"
      />
      <NmorphButton
        v-if="!isEditingCurrentRoomMessage"
        shape="square"
        :aria-label="$t(CHAT_ROOM_CONTENT_I18N.selectEmoji)"
      >
        <template #icon>
          <NmorphIconSmile />
        </template>
      </NmorphButton>
      <NmorphButton
        v-if="isEditingCurrentRoomMessage"
        shape="square"
        :disabled="!canSubmitMessageEdit"
        :loading="isUpdatingEditedMessage"
        :aria-label="$t(CHAT_ROOM_CONTENT_I18N.saveMessageEdit)"
        @click="submitMessageEdit"
      >
        <template #icon>
          <NmorphIconCheck />
        </template>
      </NmorphButton>
      <NmorphButton
        v-else
        shape="square"
        :disabled="isSendDisabled"
        :aria-label="$t(CHAT_ROOM_CONTENT_I18N.sendMessage)"
        @click="sendMessage(props.room.id)"
      >
        <template #icon>
          <NmorphIconSendFilled />
        </template>
      </NmorphButton>
    </div>
  </NmorphCard>
</template>

<style lang="scss">
.chat-room-content-footer__content {
  display: grid;
  gap: 8px;
}

.chat-room-content-footer__edit-preview {
  cursor: pointer;
  padding: 0 8px 4px 0;
}

.chat-room-content-footer__controls {
  display: flex;
  gap: 8px;
}
</style>
