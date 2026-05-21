import { isUnknownObject } from 'global-shared'
import { computed, ref, toRef } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'
import type { IChatRoomContextMenuOption, IChatRoomContextMenuProps } from '../config/types'

import { useChatRoomMarkAsRead } from './use-chat-room-mark-as-read.model'
import { useChatRoomPin } from './use-chat-room-pin.model'

export const useChatRoomContextMenu = (props: IChatRoomContextMenuProps) => {
  const { t } = useI18n()
  const item = toRef(props, 'item')
  const { canMarkChatRoomAsRead, markChatRoomAsRead } = useChatRoomMarkAsRead(item)
  const { canUpdatePinnedChatRoom, togglePinnedChatRoom } = useChatRoomPin(item)
  const isContextMenuOpen = ref(false)
  const contextMenuOptions = computed<IChatRoomContextMenuOption[]>(() => [
    {
      label: item.value.isPinned ? t(CHAT_ROOM_PAGE_I18N.unpinChat) : t(CHAT_ROOM_PAGE_I18N.pinChat),
      value: item.value.isPinned ? 'unpin-chat' : 'pin-chat',
      disabled: !canUpdatePinnedChatRoom.value
    },
    {
      label: t(CHAT_ROOM_PAGE_I18N.markAsRead),
      value: 'mark-as-read',
      disabled: !canMarkChatRoomAsRead.value
    }
  ])

  const setContextMenuOpen = (value: boolean) => {
    isContextMenuOpen.value = value
  }

  const selectChatRoomAction = (option: unknown) => {
    if (!isUnknownObject(option)) return

    switch (option.value) {
      case 'mark-as-read':
        markChatRoomAsRead()
        break
      case 'pin-chat':
      case 'unpin-chat':
        togglePinnedChatRoom()
        break
    }
  }

  return {
    isContextMenuOpen,
    contextMenuOptions,
    setContextMenuOpen,
    selectChatRoomAction
  }
}
