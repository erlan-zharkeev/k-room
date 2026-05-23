<script setup lang="ts">
import {
  NmorphButton,
  NmorphCard,
  NmorphDialog,
  NmorphFileUpload,
  NmorphIconSearch,
  NmorphTextInput
} from '@nmorph/nmorph-ui-kit'
import { CHAT_ROOM_NAME_MAX_LENGTH } from 'global-shared'

import { AppText, AppUserPicker } from 'src/shared/ui'

import { CREATE_CHAT_ROOM_AVATAR_ALLOWED_TYPES, CREATE_CHAT_ROOM_CONTACT_PICKER_LIMIT } from '../config/constants'
import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'
import type { ChatRoomFormDialogEmit, ChatRoomFormDialogProps } from '../config/types'
import { useChatRoomFormDialog } from '../model/use-chat-room-form-dialog.model'

const isOpen = defineModel<boolean>({ required: true })
const props = defineProps<ChatRoomFormDialogProps>()
const emit = defineEmits<ChatRoomFormDialogEmit>()

const {
  chatAvatarUploadValue,
  chatRoomNameInputValue,
  contactSearchQuery,
  isSavingChatRoom,
  selectedContactIds,
  contactPickerItems,
  filteredContactPickerItems,
  isChatRoomNameEditable,
  isChatRoomAvatarEditable,
  canSubmitChatRoom,
  submitChatRoomButtonI18n,
  dialogTitleI18n,
  showNoContactSearchResults,
  closeChatRoomFormDialog,
  updateChatRoomFormDialogOpen,
  updateChatRoomName,
  updateChatAvatar,
  showUnsupportedChatAvatarFormatError,
  submitChatRoom
} = useChatRoomFormDialog(props, isOpen, (roomId) => emit('open-room', roomId))
</script>

<template>
  <NmorphDialog :model-value="isOpen" :title="$t(dialogTitleI18n)" @update:model-value="updateChatRoomFormDialogOpen">
    <div class="chat-room-form-dialog">
      <NmorphTextInput
        :model-value="chatRoomNameInputValue"
        :disabled="!isChatRoomNameEditable"
        clearable
        :placeholder="$t(CHAT_ROOM_PAGE_I18N.chatName)"
        :input-attrs="{ maxLength: CHAT_ROOM_NAME_MAX_LENGTH, 'aria-label': $t(CHAT_ROOM_PAGE_I18N.chatName) }"
        @update:model-value="updateChatRoomName"
      />
      <NmorphFileUpload
        :allowed-types="CREATE_CHAT_ROOM_AVATAR_ALLOWED_TYPES"
        :button-text="$t(CHAT_ROOM_PAGE_I18N.uploadChatImage)"
        :disabled="!isChatRoomAvatarEditable || isSavingChatRoom"
        :model-value="chatAvatarUploadValue"
        :multiple="false"
        @update:model-value="updateChatAvatar"
        @on-unsupported-file-type-error="showUnsupportedChatAvatarFormatError"
      />
      <NmorphTextInput
        v-if="contactPickerItems.length"
        :model-value="contactSearchQuery"
        clearable
        :placeholder="$t(CHAT_ROOM_PAGE_I18N.contactSearch)"
        :input-attrs="{ 'aria-label': $t(CHAT_ROOM_PAGE_I18N.contactSearch) }"
        @update:model-value="contactSearchQuery = $event"
      >
        <template #prepend-icon>
          <NmorphIconSearch />
        </template>
      </NmorphTextInput>
      <AppText
        v-if="!contactPickerItems.length"
        color="semi-contrast-text"
        :selectable="false"
        :text="$t(CHAT_ROOM_PAGE_I18N.noContacts)"
      />
      <NmorphCard v-else shadow-type="inset" class="chat-room-form-dialog__contacts-card">
        <AppText
          v-if="showNoContactSearchResults"
          color="semi-contrast-text"
          :selectable="false"
          :text="$t(CHAT_ROOM_PAGE_I18N.noContactSearchResults)"
        />
        <AppUserPicker
          v-else
          v-model="selectedContactIds"
          :items="filteredContactPickerItems"
          :max-selected="CREATE_CHAT_ROOM_CONTACT_PICKER_LIMIT"
        />
      </NmorphCard>
      <div class="chat-room-form-dialog__actions">
        <NmorphButton
          style-type="transparent"
          :text="$t(CHAT_ROOM_PAGE_I18N.cancel)"
          :disabled="isSavingChatRoom"
          @click="closeChatRoomFormDialog"
          fill
        />
        <NmorphButton
          fill
          :text="$t(submitChatRoomButtonI18n)"
          :loading="isSavingChatRoom"
          :disabled="!canSubmitChatRoom"
          @click="submitChatRoom"
        />
      </div>
    </div>
  </NmorphDialog>
</template>

<style lang="scss">
.chat-room-form-dialog {
  display: grid;
  gap: 8px;
  padding: 8px;
}

.chat-room-form-dialog__contacts-card {
  min-width: 0;
}

.chat-room-form-dialog__actions {
  display: flex;
  gap: 8px;
}
</style>
