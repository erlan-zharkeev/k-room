<script setup lang="ts">
import {
  NmorphButton,
  NmorphCard,
  NmorphDropdown,
  NmorphEmojiPicker,
  NmorphIconCheck,
  NmorphIconClose,
  NmorphFileUpload,
  NmorphIconPaperclip,
  NmorphIconSendFilled,
  NmorphTextInput,
  NmorphIconSmile
} from '@nmorph/nmorph-ui-kit'
import { MESSAGE_BODY_MAX_LENGTH } from 'global-shared'
import { toRef } from 'vue'

import { MESSAGE_IMAGE_ALLOWED_TYPES } from '../config/constants'
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
  messageEmojiDropdownAnchor,
  messageImageDraftImages,
  messageImageDraftUploadValue,
  emojiPickerLocale,
  emojiPickerQuickList,
  editingMessagePreviewText,
  editingMessageImages,
  messageDraftReference,
  messageDraftReferencePreviewText,
  messageDraftReferenceTitle,
  messageEditText,
  isMessageEmojiDropdownOpen,
  isSendDisabled,
  canSubmitMessageEdit,
  isEditingCurrentRoomMessage,
  isMessageDraftReferenceCurrentRoom,
  isUpdatingEditedMessage,
  cancelMessageEdit,
  cancelMessageDraftReference,
  closeMessageEmojiDropdown,
  openMessageImageUpload,
  removeEditingMessageImage,
  removeMessageImageDraft,
  selectMessageEmoji,
  selectEditingMessage,
  selectMessageDraftReference,
  sendMessage,
  showUnsupportedMessageImageFormatError,
  toggleMessageEmojiDropdown,
  updateMessageImageDraft,
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
    <div
      v-else-if="isMessageDraftReferenceCurrentRoom && messageDraftReference"
      class="chat-room-content-footer__draft-reference-preview"
    >
      <button
        type="button"
        class="chat-room-content-footer__draft-reference-select"
        @click="selectMessageDraftReference"
      >
        <MessagePreview :title="messageDraftReferenceTitle" :text="messageDraftReferencePreviewText" />
      </button>
      <NmorphButton
        style-type="transparent"
        shape="square"
        :aria-label="$t(CHAT_ROOM_CONTENT_I18N.cancel)"
        @click="cancelMessageDraftReference"
      >
        <template #icon-only>
          <NmorphIconClose />
        </template>
      </NmorphButton>
    </div>
    <MessageImageDraftList
      v-if="isEditingCurrentRoomMessage"
      :images="editingMessageImages"
      :remove-aria-label="$t(CHAT_ROOM_CONTENT_I18N.removeMessageImage)"
      @remove="removeEditingMessageImage"
    />
    <MessageImageDraftList
      v-else
      :images="messageImageDraftImages"
      :remove-aria-label="$t(CHAT_ROOM_CONTENT_I18N.removeMessageImage)"
      @remove="removeMessageImageDraft"
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
      <NmorphFileUpload
        v-else
        ref="messageImageUpload"
        class="chat-room-content-footer__attach-upload"
        :allowed-types="MESSAGE_IMAGE_ALLOWED_TYPES"
        :model-value="messageImageDraftUploadValue"
        :multiple="true"
        :photo-with-preview="false"
        compact
        layout="inline"
        @update:model-value="updateMessageImageDraft"
        @on-unsupported-file-type-error="showUnsupportedMessageImageFormatError"
      >
        <template #trigger>
          <NmorphButton
            shape="square"
            :aria-label="$t(CHAT_ROOM_CONTENT_I18N.attachFile)"
            @click="openMessageImageUpload"
          >
            <template #icon>
              <NmorphIconPaperclip />
            </template>
          </NmorphButton>
        </template>
      </NmorphFileUpload>
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
      <span v-if="!isEditingCurrentRoomMessage" ref="messageEmojiDropdownAnchor">
        <NmorphButton
          shape="square"
          :aria-label="$t(CHAT_ROOM_CONTENT_I18N.selectEmoji)"
          @click.stop="toggleMessageEmojiDropdown"
        >
          <template #icon>
            <NmorphIconSmile />
          </template>
        </NmorphButton>
      </span>
      <NmorphDropdown
        v-if="!isEditingCurrentRoomMessage && messageEmojiDropdownAnchor"
        :open="isMessageEmojiDropdownOpen"
        :relative-element="messageEmojiDropdownAnchor"
        placement="top-end"
        role="dialog"
        :width="300"
        :max-width="340"
        :fill-width="false"
        :restore-focus="false"
        @on-outside-click="closeMessageEmojiDropdown"
        @on-escape-keydown="closeMessageEmojiDropdown"
      >
        <div @click.stop>
          <NmorphEmojiPicker
            v-if="emojiPickerLocale"
            :data-source="emojiPickerLocale.data"
            :i18n="emojiPickerLocale.i18n"
            initial-expanded
            :language="emojiPickerLocale.language"
            :quick-list="emojiPickerQuickList"
            @select="selectMessageEmoji"
          />
        </div>
      </NmorphDropdown>
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

.chat-room-content-footer__draft-reference-preview {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 8px;
  align-items: center;
}

.chat-room-content-footer__draft-reference-select {
  cursor: pointer;

  padding: 0 8px 4px 0;
  border: 0;

  color: inherit;
  text-align: left;
}

.chat-room-content-footer__attach-upload {
  flex: 0 0 auto;
  width: auto;
}

.chat-room-content-footer__attach-upload .nmorph-file-upload__list {
  display: none;
}

.chat-room-content-footer__controls {
  display: flex;
  gap: 8px;
}
</style>
