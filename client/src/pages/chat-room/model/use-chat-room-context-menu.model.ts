import { isUnknownObject } from 'global-shared'
import { computed, ref, toRef } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'
import type { IChatRoomContextMenuOption, IChatRoomContextMenuProps } from '../config/types'

import { useChatRoomMarkAsRead } from './use-chat-room-mark-as-read.model'

export const useChatRoomContextMenu = (props: IChatRoomContextMenuProps) => {
  const { t } = useI18n()
  const item = toRef(props, 'item')
  const { canMarkChatRoomAsRead, markChatRoomAsRead } = useChatRoomMarkAsRead(item)
  const isContextMenuOpen = ref(false)
  const contextMenuOptions = computed<IChatRoomContextMenuOption[]>(() => [
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

    if (option.value === 'mark-as-read') {
      markChatRoomAsRead()
    }
  }

  return {
    isContextMenuOpen,
    contextMenuOptions,
    setContextMenuOpen,
    selectChatRoomAction
  }
}
