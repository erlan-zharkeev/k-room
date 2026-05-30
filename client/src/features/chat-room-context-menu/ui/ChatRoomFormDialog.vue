<script setup lang="ts">
import {
  NmorphButton,
  NmorphCard,
  NmorphDialog,
  NmorphFileUpload,
  NmorphForm,
  NmorphFormItem,
  NmorphIconSearch,
  NmorphTextInput
} from '@nmorph/nmorph-ui-kit'
import { CHAT_ROOM_NAME_MAX_LENGTH } from 'global-shared'

import { AppProfilePicker, AppText } from 'src/shared/ui'

import { CREATE_CHAT_ROOM_AVATAR_ALLOWED_TYPES } from '../config/constants'
import { CHAT_ROOM_CONTEXT_MENU_I18N } from '../config/i18n'
import type { ChatRoomFormDialogEmit, ChatRoomFormDialogProps } from '../config/types'
import { useChatRoomFormDialog } from '../model/use-chat-room-form-dialog.model'

const isOpen = defineModel<boolean>({ required: true })
const props = defineProps<ChatRoomFormDialogProps>()
const emit = defineEmits<ChatRoomFormDialogEmit>()

const {
  chatRoomFormValidationData,
  chatAvatarUploadValue,
  isSavingChatRoom,
  selectedMemberIds,
  contactPickerItems,
  filteredContactPickerItems,
  lockedMemberIds,
  maxSelectedMemberIds,
  isChatRoomNameEditable,
  isChatRoomAvatarEditable,
  canSubmitChatRoom,
  submitChatRoomButtonI18n,
  dialogTitleI18n,
  showNoContactSearchResults,
  closeChatRoomFormDialog,
  updateChatRoomFormDialogOpen,
  updateChatRoomName,
  updateSelectedMemberIds,
  updateChatAvatar,
  showUnsupportedChatAvatarFormatError,
  submitChatRoom
} = useChatRoomFormDialog(props, isOpen, (roomId) => emit('open-room', roomId))
</script>

<template>
  <NmorphDialog :model-value="isOpen" :title="$t(dialogTitleI18n)" @update:model-value="updateChatRoomFormDialogOpen">
    <NmorphForm :value="chatRoomFormValidationData" class="chat-room-form-dialog" @submit.prevent="submitChatRoom">
      <NmorphFormItem id="chatName" :show-validation-icon="false">
        <NmorphTextInput
          :disabled="!isChatRoomNameEditable"
          clearable
          :placeholder="$t(CHAT_ROOM_CONTEXT_MENU_I18N.chatName)"
          :input-attrs="{
            maxLength: CHAT_ROOM_NAME_MAX_LENGTH,
            'aria-label': $t(CHAT_ROOM_CONTEXT_MENU_I18N.chatName)
          }"
          @update:model-value="updateChatRoomName"
        />
      </NmorphFormItem>
      <NmorphFormItem id="avatar" :show-validation-icon="false">
        <NmorphFileUpload
          :allowed-types="CREATE_CHAT_ROOM_AVATAR_ALLOWED_TYPES"
          :button-text="$t(CHAT_ROOM_CONTEXT_MENU_I18N.uploadChatImage)"
          :disabled="!isChatRoomAvatarEditable || isSavingChatRoom"
          :model-value="chatAvatarUploadValue"
          :multiple="false"
          file-name-width="174px"
          @update:model-value="updateChatAvatar"
          @on-unsupported-file-type-error="showUnsupportedChatAvatarFormatError"
        />
      </NmorphFormItem>
      <NmorphFormItem v-if="contactPickerItems.length" id="contactSearch" :show-validation-icon="false">
        <NmorphTextInput
          clearable
          :placeholder="$t(CHAT_ROOM_CONTEXT_MENU_I18N.contactSearch)"
          :input-attrs="{ 'aria-label': $t(CHAT_ROOM_CONTEXT_MENU_I18N.contactSearch) }"
        >
          <template #prepend-icon>
            <NmorphIconSearch />
          </template>
        </NmorphTextInput>
      </NmorphFormItem>
      <NmorphFormItem id="members" :show-validation-icon="false">
        <AppText
          v-if="!contactPickerItems.length"
          color="semi-contrast-text"
          :selectable="false"
          :text="$t(CHAT_ROOM_CONTEXT_MENU_I18N.noContacts)"
        />
        <NmorphCard v-else shadow-type="inset" class="chat-room-form-dialog__contacts-card">
          <AppText
            v-if="showNoContactSearchResults"
            color="semi-contrast-text"
            :selectable="false"
            :text="$t(CHAT_ROOM_CONTEXT_MENU_I18N.noContactSearchResults)"
          />
          <AppProfilePicker
            v-else
            :model-value="selectedMemberIds"
            :items="filteredContactPickerItems"
            :locked-ids="lockedMemberIds"
            :max-selected="maxSelectedMemberIds"
            @update:model-value="updateSelectedMemberIds"
          />
        </NmorphCard>
      </NmorphFormItem>
      <div class="chat-room-form-dialog__actions">
        <NmorphButton
          style-type="transparent"
          type="button"
          :text="$t(CHAT_ROOM_CONTEXT_MENU_I18N.cancel)"
          :disabled="isSavingChatRoom"
          @click="closeChatRoomFormDialog"
          fill
        />
        <NmorphButton
          fill
          style-type="transparent"
          color="var(--nmorph-accent-color)"
          :text="$t(submitChatRoomButtonI18n)"
          :loading="isSavingChatRoom"
          :disabled="!canSubmitChatRoom"
          type="submit"
        />
      </div>
    </NmorphForm>
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

  .nmorph-checkbox-group__content {
    padding: 1px 0;
  }
}

.chat-room-form-dialog__actions {
  display: flex;
  gap: 8px;
}
</style>
