<script setup lang="ts">
import { NmorphText, NmorphButton } from '@nmorph/nmorph-ui-kit'

import { AppDialog, AppProfilePicker } from 'src/shared/ui'

import { CHAT_ROOM_CONTEXT_MENU_I18N } from '../config/i18n'
import type { ChatRoomLeaveDialogProps } from '../config/types'
import { useChatRoomLeave } from '../model/use-chat-room-leave.model'

const model = defineModel<boolean>({ required: true })
const props = defineProps<ChatRoomLeaveDialogProps>()
const {
  canLeaveChatRoom,
  closeLeaveChatRoomDialog,
  hasNewAdminCandidates,
  isLeavingChatRoom,
  leaveChatRoom,
  newAdminItems,
  selectedNewAdminIds,
  shouldOfferNewAdminSelection
} = useChatRoomLeave(props, model)
</script>

<template>
  <AppDialog v-model="model" :title="$t(CHAT_ROOM_CONTEXT_MENU_I18N.leaveGroupTitle)">
    <div class="app-dialog-stack">
      <NmorphText>{{
        $t(
          shouldOfferNewAdminSelection
            ? CHAT_ROOM_CONTEXT_MENU_I18N.leaveGroupAdminConfirm
            : CHAT_ROOM_CONTEXT_MENU_I18N.leaveGroupConfirm
        )
      }}</NmorphText>
      <div v-if="shouldOfferNewAdminSelection" class="app-dialog-stack">
        <NmorphText v-if="hasNewAdminCandidates" as="small" color="semi-contrast" variant="body-small">{{
          $t(CHAT_ROOM_CONTEXT_MENU_I18N.newGroupAdministrator)
        }}</NmorphText>
        <AppProfilePicker
          v-if="hasNewAdminCandidates"
          v-model="selectedNewAdminIds"
          :items="newAdminItems"
          :multiple="false"
          height="180px"
          max-height="32vh"
        />
        <NmorphText v-else color="semi-contrast">{{
          $t(CHAT_ROOM_CONTEXT_MENU_I18N.leaveGroupAdminAutomatic)
        }}</NmorphText>
      </div>
      <div class="app-dialog-actions">
        <NmorphButton
          :text="$t(CHAT_ROOM_CONTEXT_MENU_I18N.cancel)"
          design="plain"
          borderless
          :disabled="isLeavingChatRoom"
          @click="closeLeaveChatRoomDialog"
        />
        <NmorphButton
          design="plain"
          borderless
          color="var(--nmorph-error-text-color)"
          :text="$t(CHAT_ROOM_CONTEXT_MENU_I18N.leaveGroup)"
          :disabled="!canLeaveChatRoom"
          :loading="isLeavingChatRoom"
          @click="leaveChatRoom"
        />
      </div>
    </div>
  </AppDialog>
</template>
