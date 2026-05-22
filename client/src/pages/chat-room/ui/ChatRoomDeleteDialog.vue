<script setup lang="ts">
import { NmorphButton, NmorphDialog } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'
import type { ChatRoomDeleteDialogProps } from '../config/types'
import { useChatRoomDelete } from '../model/use-chat-room-delete.model'

const model = defineModel<boolean>({ required: true })
const props = defineProps<ChatRoomDeleteDialogProps>()
const { canDeleteChatRoom, closeDeleteChatRoomDialog, deleteChatRoom, isDeletingChatRoom } = useChatRoomDelete(
  props,
  model
)
</script>

<template>
  <NmorphDialog v-model="model" :title="$t(CHAT_ROOM_PAGE_I18N.deleteChatTitle)">
    <div class="chat-room-delete-dialog">
      <AppText :text="$t(CHAT_ROOM_PAGE_I18N.deleteChatConfirm)" />
      <div class="chat-room-delete-dialog__actions">
        <NmorphButton
          :text="$t(CHAT_ROOM_PAGE_I18N.cancel)"
          style-type="transparent"
          :disabled="isDeletingChatRoom"
          @click="closeDeleteChatRoomDialog"
        />
        <NmorphButton
          style-type="transparent"
          color="var(--nmorph-error-text-color)"
          :text="$t(CHAT_ROOM_PAGE_I18N.deleteChat)"
          :disabled="!canDeleteChatRoom"
          :loading="isDeletingChatRoom"
          @click="deleteChatRoom"
        />
      </div>
    </div>
  </NmorphDialog>
</template>

<style lang="scss">
.chat-room-delete-dialog {
  display: grid;
  gap: 8px;
}

.chat-room-delete-dialog__actions {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
}
</style>
