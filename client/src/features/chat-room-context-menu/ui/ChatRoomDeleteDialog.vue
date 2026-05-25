<script setup lang="ts">
import { NmorphButton, NmorphDialog } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { CHAT_ROOM_CONTEXT_MENU_I18N } from '../config/i18n'
import type { ChatRoomDeleteDialogProps } from '../config/types'
import { useChatRoomDelete } from '../model/use-chat-room-delete.model'

const model = defineModel<boolean>({ required: true })
const props = defineProps<ChatRoomDeleteDialogProps>()
const { canDeleteChatRoom, closeDeleteChatRoomDialog, deleteChatRoom, deleteChatRoomConfirmText, isDeletingChatRoom } =
  useChatRoomDelete(props, model)
</script>

<template>
  <NmorphDialog v-model="model" :title="$t(CHAT_ROOM_CONTEXT_MENU_I18N.deleteChatTitle)">
    <div class="app-dialog-stack">
      <AppText :text="deleteChatRoomConfirmText" />
      <div class="app-dialog-actions">
        <NmorphButton
          :text="$t(CHAT_ROOM_CONTEXT_MENU_I18N.cancel)"
          style-type="transparent"
          :disabled="isDeletingChatRoom"
          @click="closeDeleteChatRoomDialog"
        />
        <NmorphButton
          style-type="transparent"
          color="var(--nmorph-error-text-color)"
          :text="$t(CHAT_ROOM_CONTEXT_MENU_I18N.deleteChat)"
          :disabled="!canDeleteChatRoom"
          :loading="isDeletingChatRoom"
          @click="deleteChatRoom"
        />
      </div>
    </div>
  </NmorphDialog>
</template>
