import { computed, toRef } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageContextMenuActionItemEmit, MessageContextMenuActionItemProps } from '../config/types'

import { useMessageCopyText } from './use-message-copy-text.model'

export const useMessageCopyTextContextMenuItem = (
  props: MessageContextMenuActionItemProps,
  emit: MessageContextMenuActionItemEmit
) => {
  const { t } = useI18n()
  const message = toRef(props, 'message')
  const { canCopyMessageText, copyMessageText } = useMessageCopyText(message)
  const messageCopyTextContextMenuItemLabel = computed(() => t(CHAT_ROOM_CONTENT_I18N.copyMessageText))

  const selectMessageCopyTextContextMenuItem = async () => {
    if (!canCopyMessageText.value) return

    await copyMessageText()
    emit('select')
  }

  return {
    canCopyMessageText,
    messageCopyTextContextMenuItemLabel,
    selectMessageCopyTextContextMenuItem
  }
}
