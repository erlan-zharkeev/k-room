import { computed, toRef } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageContextMenuActionItemEmit, MessageContextMenuActionItemProps } from '../config/types'

import { useMessagePin } from './use-message-pin.model'

export const useMessagePinContextMenuItem = (
  props: MessageContextMenuActionItemProps,
  emit: MessageContextMenuActionItemEmit
) => {
  const { t } = useI18n()
  const message = toRef(props, 'message')
  const room = toRef(props, 'room')
  const { canUpdatePinnedMessage, isMessagePinned, togglePinnedMessage } = useMessagePin(message, room)
  const messagePinContextMenuItemLabel = computed(() =>
    t(isMessagePinned.value ? CHAT_ROOM_CONTENT_I18N.unpinMessage : CHAT_ROOM_CONTENT_I18N.pinMessage)
  )

  const selectMessagePinContextMenuItem = () => {
    if (!canUpdatePinnedMessage.value) return

    togglePinnedMessage()
    emit('select')
  }

  return {
    canUpdatePinnedMessage,
    messagePinContextMenuItemLabel,
    selectMessagePinContextMenuItem
  }
}
