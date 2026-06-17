import { computed } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageContextMenuActionItemEmit, MessageContextMenuDialogActionItemProps } from '../config/types'

export const useMessageForwardContextMenuItem = (
  props: MessageContextMenuDialogActionItemProps,
  emit: MessageContextMenuActionItemEmit
) => {
  const { t } = useI18n()
  const messageForwardContextMenuItemLabel = computed(() => t(CHAT_ROOM_CONTENT_I18N.forwardMessage))

  const selectMessageForwardContextMenuItem = () => {
    props.openDialog()
    emit('select')
  }

  return {
    messageForwardContextMenuItemLabel,
    selectMessageForwardContextMenuItem
  }
}
