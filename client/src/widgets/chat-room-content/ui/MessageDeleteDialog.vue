<script setup lang="ts">
import { NmorphText, NmorphButton, NmorphDialog } from '@nmorph/nmorph-ui-kit'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageDeleteDialogProps } from '../config/types'
import { useMessageDelete } from '../model/use-message-delete.model'

const model = defineModel<boolean>({ required: true })
const props = defineProps<MessageDeleteDialogProps>()
const {
  canDeleteMessageForMe,
  canDeleteMessageForEveryone,
  closeDeleteMessageDialog,
  deleteMessageForMe,
  deleteMessageForEveryone,
  isDeletingMessage
} = useMessageDelete(props, model)
</script>

<template>
  <NmorphDialog v-model="model" :title="$t(CHAT_ROOM_CONTENT_I18N.deleteMessageTitle)">
    <div class="app-dialog-stack">
      <NmorphText>{{ $t(CHAT_ROOM_CONTENT_I18N.deleteMessageConfirm) }}</NmorphText>
      <div class="app-dialog-actions">
        <NmorphButton
          :text="$t(CHAT_ROOM_CONTENT_I18N.cancel)"
          design="plain"
          borderless
          :disabled="isDeletingMessage"
          @click="closeDeleteMessageDialog"
        />
        <NmorphButton
          design="plain"
          borderless
          color="var(--nmorph-error-text-color)"
          :text="$t(CHAT_ROOM_CONTENT_I18N.deleteMessageForMe)"
          :disabled="!canDeleteMessageForMe"
          :loading="isDeletingMessage"
          @click="deleteMessageForMe"
        />
        <NmorphButton
          v-if="props.message.isSelf"
          design="plain"
          borderless
          color="var(--nmorph-error-text-color)"
          :text="$t(CHAT_ROOM_CONTENT_I18N.deleteMessageForEveryone)"
          :disabled="!canDeleteMessageForEveryone"
          :loading="isDeletingMessage"
          @click="deleteMessageForEveryone"
        />
      </div>
    </div>
  </NmorphDialog>
</template>
