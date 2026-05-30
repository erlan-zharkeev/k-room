<script setup lang="ts">
import { NmorphButton, NmorphCard, NmorphDialog, NmorphIconSearch, NmorphTextInput } from '@nmorph/nmorph-ui-kit'

import { AppProfilePicker, AppText } from 'src/shared/ui'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageForwardDialogProps } from '../config/types'
import { useMessageForward } from '../model/use-message-forward.model'

const isOpen = defineModel<boolean>({ required: true })
const props = defineProps<MessageForwardDialogProps>()
const {
  selectedMessageForwardRoomIds,
  messageForwardSearchQuery,
  filteredMessageForwardChatRoomItems,
  hasMessageForwardChatRooms,
  showMessageForwardSearchEmpty,
  canSelectMessageForwardRoom,
  isForwardingMessage,
  closeMessageForwardDialog,
  updateMessageForwardDialogOpen,
  updateSelectedMessageForwardRoomIds,
  selectMessageForwardRoom
} = useMessageForward(props, isOpen)
</script>

<template>
  <NmorphDialog
    :model-value="isOpen"
    :title="$t(CHAT_ROOM_CONTENT_I18N.forwardMessage)"
    @update:model-value="updateMessageForwardDialogOpen"
  >
    <div class="message-forward-dialog">
      <NmorphTextInput
        v-if="hasMessageForwardChatRooms"
        v-model="messageForwardSearchQuery"
        clearable
        :placeholder="$t(CHAT_ROOM_CONTENT_I18N.chatSearch)"
        :input-attrs="{ 'aria-label': $t(CHAT_ROOM_CONTENT_I18N.chatSearch) }"
      >
        <template #prepend-icon>
          <NmorphIconSearch />
        </template>
      </NmorphTextInput>
      <NmorphCard v-if="hasMessageForwardChatRooms" shadow-type="inset" class="message-forward-dialog__rooms-card">
        <AppText
          v-if="showMessageForwardSearchEmpty"
          color="semi-contrast-text"
          :selectable="false"
          :text="$t(CHAT_ROOM_CONTENT_I18N.noChatSearchResults)"
        />
        <AppProfilePicker
          v-else
          :model-value="selectedMessageForwardRoomIds"
          :items="filteredMessageForwardChatRoomItems"
          :multiple="false"
          @update:model-value="updateSelectedMessageForwardRoomIds"
        />
      </NmorphCard>
      <AppText v-else color="semi-contrast-text" :selectable="false" :text="$t(CHAT_ROOM_CONTENT_I18N.noChats)" />
      <div class="message-forward-dialog__actions">
        <NmorphButton
          style-type="transparent"
          type="button"
          :text="$t(CHAT_ROOM_CONTENT_I18N.cancel)"
          @click="closeMessageForwardDialog"
          fill
        />
        <NmorphButton
          fill
          style-type="transparent"
          color="var(--nmorph-accent-color)"
          :text="$t(CHAT_ROOM_CONTENT_I18N.forwardMessage)"
          :disabled="!canSelectMessageForwardRoom"
          :loading="isForwardingMessage"
          @click="selectMessageForwardRoom"
        />
      </div>
    </div>
  </NmorphDialog>
</template>

<style lang="scss">
.message-forward-dialog {
  display: grid;
  gap: 8px;
  padding: 8px;
}

.message-forward-dialog__actions {
  display: flex;
  gap: 8px;
}
</style>
