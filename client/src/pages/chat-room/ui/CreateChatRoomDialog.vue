<script setup lang="ts">
import {
  NmorphButton,
  NmorphCard,
  NmorphDialog,
  NmorphFileUpload,
  NmorphIconSearch,
  NmorphTextInput
} from '@nmorph/nmorph-ui-kit'

import { AppText, AppUserPicker } from 'src/shared/ui'

import { CREATE_CHAT_ROOM_AVATAR_ALLOWED_TYPES } from '../config/constants'
import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'
import type { CreateChatRoomDialogEmit } from '../config/types'
import { useCreateChatRoomDialog } from '../model/use-create-chat-room-dialog.model'

const isOpen = defineModel<boolean>({ required: true })
const emit = defineEmits<CreateChatRoomDialogEmit>()

const {
  chatAvatarUploadValue,
  createChatNameInputValue,
  contactSearchQuery,
  isCreatingChat,
  selectedContactIds,
  acceptedContacts,
  filteredAcceptedContacts,
  isGroupChat,
  canSubmitChat,
  submitChatButtonI18n,
  showNoContactSearchResults,
  closeCreateChatDialog,
  updateCreateChatDialogOpen,
  updateCreateChatName,
  updateChatAvatar,
  showUnsupportedChatAvatarFormatError,
  submitChat
} = useCreateChatRoomDialog(isOpen, (roomId) => emit('open-room', roomId))
</script>

<template>
  <NmorphDialog
    :model-value="isOpen"
    :title="$t(CHAT_ROOM_PAGE_I18N.createChatTitle)"
    @update:model-value="updateCreateChatDialogOpen"
  >
    <div class="create-chat-room-dialog">
      <NmorphTextInput
        :model-value="createChatNameInputValue"
        :disabled="!isGroupChat"
        clearable
        :placeholder="$t(CHAT_ROOM_PAGE_I18N.chatName)"
        :input-attrs="{ 'aria-label': $t(CHAT_ROOM_PAGE_I18N.chatName) }"
        @update:model-value="updateCreateChatName"
      />
      <NmorphFileUpload
        :allowed-types="CREATE_CHAT_ROOM_AVATAR_ALLOWED_TYPES"
        :button-text="$t(CHAT_ROOM_PAGE_I18N.uploadChatImage)"
        :disabled="!isGroupChat || isCreatingChat"
        :model-value="chatAvatarUploadValue"
        :multiple="false"
        class="create-chat-room-dialog__avatar-upload"
        @update:model-value="updateChatAvatar"
        @on-unsupported-file-type-error="showUnsupportedChatAvatarFormatError"
      />
      <NmorphTextInput
        v-if="acceptedContacts.length"
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
        v-if="!acceptedContacts.length"
        color="semi-contrast-text"
        :selectable="false"
        :text="$t(CHAT_ROOM_PAGE_I18N.noContacts)"
      />
      <NmorphCard v-else shadow-type="inset" class="create-chat-room-dialog__contacts-card">
        <AppText
          v-if="showNoContactSearchResults"
          color="semi-contrast-text"
          :selectable="false"
          :text="$t(CHAT_ROOM_PAGE_I18N.noContactSearchResults)"
        />
        <AppUserPicker v-else v-model="selectedContactIds" :items="filteredAcceptedContacts" />
      </NmorphCard>
      <div class="create-chat-room-dialog__actions">
        <NmorphButton
          style-type="transparent"
          :text="$t(CHAT_ROOM_PAGE_I18N.cancel)"
          :disabled="isCreatingChat"
          @click="closeCreateChatDialog"
          fill
        />
        <NmorphButton
          fill
          class="create-chat-room-dialog__submit"
          :text="$t(submitChatButtonI18n)"
          :loading="isCreatingChat"
          :disabled="!canSubmitChat"
          @click="submitChat"
        />
      </div>
    </div>
  </NmorphDialog>
</template>

<style lang="scss">
.create-chat-room-dialog {
  display: grid;
  gap: 8px;
  padding: 8px;
}

.create-chat-room-dialog__contacts-card {
  min-width: 0;
}

.create-chat-room-dialog__actions {
  display: flex;
  gap: 8px;
}
</style>
