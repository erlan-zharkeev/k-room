<script setup lang="ts">
import { NmorphButton, NmorphDialog } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'
import type { ChatRoomDeleteDialogEmitType } from '../config/types'

const model = defineModel<boolean>({ required: true })
const emit = defineEmits<ChatRoomDeleteDialogEmitType>()
</script>

<template>
  <NmorphDialog v-model="model" :title="$t(CHAT_ROOM_PAGE_I18N.deleteChatTitle)">
    <div class="chat-room-delete-dialog">
      <AppText :text="$t(CHAT_ROOM_PAGE_I18N.deleteChatConfirm)" />
      <div class="chat-room-delete-dialog__actions">
        <NmorphButton :text="$t(CHAT_ROOM_PAGE_I18N.cancel)" style-type="transparent" @click="emit('cancel')" />
        <NmorphButton
          style-type="transparent"
          color="var(--nmorph-error-text-color)"
          :text="$t(CHAT_ROOM_PAGE_I18N.deleteChat)"
          @click="emit('confirm')"
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
