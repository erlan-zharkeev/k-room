<script setup lang="ts">
import { NmorphButton, NmorphDialog } from '@nmorph/nmorph-ui-kit'

import { AppText, AppUserPicker } from 'src/shared/ui'

import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'
import type { ChatRoomLeaveDialogProps } from '../config/types'
import { useChatRoomLeave } from '../model/use-chat-room-leave.model'

const model = defineModel<boolean>({ required: true })
const props = defineProps<ChatRoomLeaveDialogProps>()
const {
  canLeaveChatRoom,
  closeLeaveChatRoomDialog,
  isCurrentUserChatRoomAdmin,
  isLeavingChatRoom,
  leaveChatRoom,
  newAdminItems,
  selectedNewAdminIds
} = useChatRoomLeave(props, model)
</script>

<template>
  <NmorphDialog v-model="model" :title="$t(CHAT_ROOM_PAGE_I18N.leaveGroupTitle)">
    <div class="chat-room-leave-dialog">
      <AppText
        :text="
          $t(
            isCurrentUserChatRoomAdmin
              ? CHAT_ROOM_PAGE_I18N.leaveGroupAdminConfirm
              : CHAT_ROOM_PAGE_I18N.leaveGroupConfirm
          )
        "
      />
      <div v-if="isCurrentUserChatRoomAdmin" class="chat-room-leave-dialog__new-admin">
        <AppText tag="small" color="semi-contrast-text" :text="$t(CHAT_ROOM_PAGE_I18N.newGroupAdministrator)" />
        <AppUserPicker
          v-model="selectedNewAdminIds"
          :items="newAdminItems"
          :multiple="false"
          height="180px"
          max-height="32vh"
        />
      </div>
      <div class="chat-room-leave-dialog__actions">
        <NmorphButton
          :text="$t(CHAT_ROOM_PAGE_I18N.cancel)"
          style-type="transparent"
          :disabled="isLeavingChatRoom"
          @click="closeLeaveChatRoomDialog"
        />
        <NmorphButton
          style-type="transparent"
          color="var(--nmorph-error-text-color)"
          :text="$t(CHAT_ROOM_PAGE_I18N.leaveGroup)"
          :disabled="!canLeaveChatRoom"
          :loading="isLeavingChatRoom"
          @click="leaveChatRoom"
        />
      </div>
    </div>
  </NmorphDialog>
</template>

<style lang="scss">
.chat-room-leave-dialog {
  display: grid;
  gap: 8px;
}

.chat-room-leave-dialog__new-admin {
  display: grid;
  gap: 8px;
}

.chat-room-leave-dialog__actions {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
}
</style>
