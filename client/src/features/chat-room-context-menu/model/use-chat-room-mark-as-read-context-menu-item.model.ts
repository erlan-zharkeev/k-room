import { computed, toRef } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_CONTEXT_MENU_I18N } from '../config/i18n'
import type { ChatRoomContextMenuActionItemEmit, ChatRoomContextMenuActionItemProps } from '../config/types'

import { useChatRoomMarkAsRead } from './use-chat-room-mark-as-read.model'

export const useChatRoomMarkAsReadContextMenuItem = (
  props: ChatRoomContextMenuActionItemProps,
  emit: ChatRoomContextMenuActionItemEmit
) => {
  const { t } = useI18n()
  const item = toRef(props, 'item')
  const { canMarkChatRoomAsRead, markChatRoomAsRead } = useChatRoomMarkAsRead(item)
  const chatRoomMarkAsReadContextMenuItemLabel = computed(() => t(CHAT_ROOM_CONTEXT_MENU_I18N.markAsRead))

  const selectChatRoomMarkAsReadContextMenuItem = () => {
    if (!canMarkChatRoomAsRead.value) return

    markChatRoomAsRead()
    emit('select')
  }

  return {
    canMarkChatRoomAsRead,
    chatRoomMarkAsReadContextMenuItemLabel,
    selectChatRoomMarkAsReadContextMenuItem
  }
}
