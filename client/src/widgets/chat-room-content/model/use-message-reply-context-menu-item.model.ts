import { computed, toRef } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageContextMenuActionItemEmit, MessageContextMenuActionItemProps } from '../config/types'

import { useMessageDraftReference } from './use-message-draft-reference.model'

export const useMessageReplyContextMenuItem = (
  props: MessageContextMenuActionItemProps,
  emit: MessageContextMenuActionItemEmit
) => {
  const { t } = useI18n()
  const message = toRef(props, 'message')
  const room = toRef(props, 'room')
  const { startMessageReply } = useMessageDraftReference()
  const messageReplyContextMenuItemLabel = computed(() => t(CHAT_ROOM_CONTENT_I18N.replyMessage))

  const selectMessageReplyContextMenuItem = () => {
    startMessageReply(message.value, room.value.id)
    emit('select')
  }

  return {
    messageReplyContextMenuItemLabel,
    selectMessageReplyContextMenuItem
  }
}
