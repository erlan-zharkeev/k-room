<script setup lang="ts">
import { NmorphText, NmorphButton, NmorphCard, NmorphIconSearch, NmorphTextInput } from '@nmorph/nmorph-ui-kit'

import { AppDialog, AppProfilePicker } from 'src/shared/ui'

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
  <AppDialog
    :model-value="isOpen"
    :title="$t(CHAT_ROOM_CONTENT_I18N.forwardMessage)"
    variant="wide"
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
        <NmorphText v-if="showMessageForwardSearchEmpty" color="semi-contrast">{{
          $t(CHAT_ROOM_CONTENT_I18N.noChatSearchResults)
        }}</NmorphText>
        <AppProfilePicker
          v-else
          :model-value="selectedMessageForwardRoomIds"
          :items="filteredMessageForwardChatRoomItems"
          :multiple="false"
          height="300px"
          max-height="42vh"
          @update:model-value="updateSelectedMessageForwardRoomIds"
        />
      </NmorphCard>
      <NmorphText v-else color="semi-contrast">{{ $t(CHAT_ROOM_CONTENT_I18N.noChats) }}</NmorphText>
      <div class="message-forward-dialog__actions">
        <NmorphButton
          design="plain"
          borderless
          type="button"
          :text="$t(CHAT_ROOM_CONTENT_I18N.cancel)"
          @click="closeMessageForwardDialog"
          fill
        />
        <NmorphButton
          fill
          design="plain"
          borderless
          color="var(--nmorph-accent-color)"
          :text="$t(CHAT_ROOM_CONTENT_I18N.forwardMessage)"
          :disabled="!canSelectMessageForwardRoom"
          :loading="isForwardingMessage"
          @click="selectMessageForwardRoom"
        />
      </div>
    </div>
  </AppDialog>
</template>

<style lang="scss" scoped>
.message-forward-dialog {
  display: grid;
  gap: 8px;
  padding: 8px;
}

.message-forward-dialog__actions {
  display: flex;
  gap: 8px;
}

.message-forward-dialog__rooms-card {
  min-width: 0;
}
</style>
