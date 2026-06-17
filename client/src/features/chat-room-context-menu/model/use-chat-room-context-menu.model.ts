import { isUnknownObject } from 'global-shared'
import { computed, ref, toRef } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_CONTEXT_MENU_I18N } from '../config/i18n'
import type { ChatRoomContextMenuEmitFn, ChatRoomContextMenuOption, ChatRoomContextMenuProps } from '../config/types'
import ChatRoomMarkAsReadContextMenuItem from '../ui/ChatRoomMarkAsReadContextMenuItem.vue'
import ChatRoomMuteContextMenuItem from '../ui/ChatRoomMuteContextMenuItem.vue'
import ChatRoomPinContextMenuItem from '../ui/ChatRoomPinContextMenuItem.vue'

import { useChatRoomPermissions } from './use-chat-room-permissions.model'

export const useChatRoomContextMenu = (props: ChatRoomContextMenuProps, emit: ChatRoomContextMenuEmitFn) => {
  const { t } = useI18n()
  const item = toRef(props, 'item')
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
        value: item.value.isPinned ? 'unpin-chat' : 'pin-chat',
        component: ChatRoomPinContextMenuItem,
        componentProps: {
          item: item.value,
          onSelect: closeContextMenu
        },
        closeOnClick: false
      },
      {
        value: item.value.isMuted ? 'unmute-chat' : 'mute-chat',
        component: ChatRoomMuteContextMenuItem,
        componentProps: {
          item: item.value,
          onSelect: closeContextMenu
        },
        closeOnClick: false
      },
      {
        value: 'mark-as-read',
        component: ChatRoomMarkAsReadContextMenuItem,
        componentProps: {
          item: item.value,
          onSelect: closeContextMenu
        },
        closeOnClick: false
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
