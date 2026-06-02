import { isUnknownObject } from 'global-shared'
import { computed, ref, toRef } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_CONTEXT_MENU_I18N } from '../config/i18n'
import type { ChatRoomContextMenuEmitFn, ChatRoomContextMenuOption, ChatRoomContextMenuProps } from '../config/types'

import { useChatRoomMarkAsRead } from './use-chat-room-mark-as-read.model'
import { useChatRoomMute } from './use-chat-room-mute.model'
import { useChatRoomPermissions } from './use-chat-room-permissions.model'
import { useChatRoomPin } from './use-chat-room-pin.model'

export const useChatRoomContextMenu = (props: ChatRoomContextMenuProps, emit: ChatRoomContextMenuEmitFn) => {
  const { t } = useI18n()
  const item = toRef(props, 'item')
  const { canMarkChatRoomAsRead, markChatRoomAsRead } = useChatRoomMarkAsRead(item)
  const { canUpdateMutedChatRoom, toggleMutedChatRoom } = useChatRoomMute(item)
  const { canUpdatePinnedChatRoom, togglePinnedChatRoom } = useChatRoomPin(item)
  const { canEditGroupChatRoom, canShowDeleteChatRoom, canShowLeaveChatRoom } = useChatRoomPermissions(item)
  const isContextMenuOpen = ref(false)

  const updateContextMenuOpen = (value: boolean) => {
    isContextMenuOpen.value = value
  }

  const closeContextMenu = () => {
    updateContextMenuOpen(false)
  }

  const contextMenuOptions = computed<ChatRoomContextMenuOption[]>(() => {
    const options: ChatRoomContextMenuOption[] = [
      {
        label: item.value.isPinned ? t(CHAT_ROOM_CONTEXT_MENU_I18N.unpinChat) : t(CHAT_ROOM_CONTEXT_MENU_I18N.pinChat),
        value: item.value.isPinned ? 'unpin-chat' : 'pin-chat',
        disabled: !canUpdatePinnedChatRoom.value
      },
      {
        label: item.value.isMuted ? t(CHAT_ROOM_CONTEXT_MENU_I18N.unmuteChat) : t(CHAT_ROOM_CONTEXT_MENU_I18N.muteChat),
        value: item.value.isMuted ? 'unmute-chat' : 'mute-chat',
        disabled: !canUpdateMutedChatRoom.value
      },
      {
        label: t(CHAT_ROOM_CONTEXT_MENU_I18N.markAsRead),
        value: 'mark-as-read',
        disabled: !canMarkChatRoomAsRead.value
      }
    ]

    if (props.actionOptions) {
      options.push(
        ...props.actionOptions.map((option) => ({
          ...option,
          componentProps: {
            ...option.componentProps,
            onSelect: closeContextMenu
          }
        }))
      )
    }

    if (canEditGroupChatRoom.value) {
      options.push({
        label: t(CHAT_ROOM_CONTEXT_MENU_I18N.editGroup),
        value: 'edit-group'
      })
    }

    if (canShowDeleteChatRoom.value) {
      options.push({
        label: t(CHAT_ROOM_CONTEXT_MENU_I18N.deleteChat),
        value: 'delete-chat'
      })
    }

    if (canShowLeaveChatRoom.value) {
      options.push({
        label: t(CHAT_ROOM_CONTEXT_MENU_I18N.leaveGroup),
        value: 'leave-group'
      })
    }

    return options
  })

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
      case 'mute-chat':
      case 'unmute-chat':
        toggleMutedChatRoom()
        break
      case 'edit-group':
        emit('edit-group')
        break
      case 'delete-chat':
        emit('delete-chat')
        break
      case 'leave-group':
        emit('leave-group')
        break
      default:
        return
    }

    updateContextMenuOpen(false)
  }

  return {
    isContextMenuOpen,
    contextMenuOptions,
    updateContextMenuOpen,
    selectChatRoomAction
  }
}
