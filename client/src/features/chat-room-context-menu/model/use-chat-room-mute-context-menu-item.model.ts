import { computed, toRef } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_CONTEXT_MENU_I18N } from '../config/i18n'
import type { ChatRoomContextMenuActionItemEmit, ChatRoomContextMenuActionItemProps } from '../config/types'

import { useChatRoomMute } from './use-chat-room-mute.model'

export const useChatRoomMuteContextMenuItem = (
  props: ChatRoomContextMenuActionItemProps,
  emit: ChatRoomContextMenuActionItemEmit
) => {
  const { t } = useI18n()
  const item = toRef(props, 'item')
  const { canUpdateMutedChatRoom, toggleMutedChatRoom } = useChatRoomMute(item)
  const chatRoomMuteContextMenuItemLabel = computed(() =>
    t(item.value.isMuted ? CHAT_ROOM_CONTEXT_MENU_I18N.unmuteChat : CHAT_ROOM_CONTEXT_MENU_I18N.muteChat)
  )

  const selectChatRoomMuteContextMenuItem = () => {
    if (!canUpdateMutedChatRoom.value) return

    toggleMutedChatRoom()
    emit('select')
  }

  return {
    canUpdateMutedChatRoom,
    chatRoomMuteContextMenuItemLabel,
    selectChatRoomMuteContextMenuItem
  }
}
