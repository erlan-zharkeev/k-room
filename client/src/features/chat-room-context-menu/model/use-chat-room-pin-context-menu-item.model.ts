import { computed, toRef } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_CONTEXT_MENU_I18N } from '../config/i18n'
import type { ChatRoomContextMenuActionItemEmit, ChatRoomContextMenuActionItemProps } from '../config/types'

import { useChatRoomPin } from './use-chat-room-pin.model'

export const useChatRoomPinContextMenuItem = (
  props: ChatRoomContextMenuActionItemProps,
  emit: ChatRoomContextMenuActionItemEmit
) => {
  const { t } = useI18n()
  const item = toRef(props, 'item')
  const { canUpdatePinnedChatRoom, togglePinnedChatRoom } = useChatRoomPin(item)
  const chatRoomPinContextMenuItemLabel = computed(() =>
    t(item.value.isPinned ? CHAT_ROOM_CONTEXT_MENU_I18N.unpinChat : CHAT_ROOM_CONTEXT_MENU_I18N.pinChat)
  )

  const selectChatRoomPinContextMenuItem = () => {
    if (!canUpdatePinnedChatRoom.value) return

    togglePinnedChatRoom()
    emit('select')
  }

  return {
    canUpdatePinnedChatRoom,
    chatRoomPinContextMenuItemLabel,
    selectChatRoomPinContextMenuItem
  }
}
