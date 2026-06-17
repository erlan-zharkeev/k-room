import { computed, toRef } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageContextMenuActionItemEmit, MessageContextMenuActionItemProps } from '../config/types'

import { useMessageEdit } from './use-message-edit.model'

export const useMessageEditContextMenuItem = (
  props: MessageContextMenuActionItemProps,
  emit: MessageContextMenuActionItemEmit
) => {
  const { t } = useI18n()
  const message = toRef(props, 'message')
  const room = toRef(props, 'room')
  const { canStartMessageEdit, startMessageEdit } = useMessageEdit()
  const canStartMessageContextMenuEdit = computed(() => canStartMessageEdit(message.value))
  const messageEditContextMenuItemLabel = computed(() => t(CHAT_ROOM_CONTENT_I18N.editMessage))

  const selectMessageEditContextMenuItem = () => {
    if (!canStartMessageContextMenuEdit.value) return

    startMessageEdit(message.value, room.value.id)
    emit('select')
  }

  return {
    canStartMessageContextMenuEdit,
    messageEditContextMenuItemLabel,
    selectMessageEditContextMenuItem
  }
}
