import { computed, ref, toRef } from 'vue'

import { isRoomSupport } from 'src/entities/chat-room'
import { useUser } from 'src/entities/user'
import { useTouchInput } from 'src/shared/lib'

import type { MessageContextMenuOption, MessageContextMenuProps } from '../config/types'
import { canStartMessageEdit } from '../lib/can-start-message-edit'
import MessageCopyTextContextMenuItem from '../ui/MessageCopyTextContextMenuItem.vue'
import MessageDeleteContextMenuItem from '../ui/MessageDeleteContextMenuItem.vue'
import MessageEditContextMenuItem from '../ui/MessageEditContextMenuItem.vue'
import MessageForwardContextMenuItem from '../ui/MessageForwardContextMenuItem.vue'
import MessagePinContextMenuItem from '../ui/MessagePinContextMenuItem.vue'
import MessageReactionPicker from '../ui/MessageReactionPicker.vue'
import MessageReplyContextMenuItem from '../ui/MessageReplyContextMenuItem.vue'

import { useMessageDeleteDialog } from './use-message-delete-dialog.model'

export const useMessageContextMenu = (props: MessageContextMenuProps) => {
  const message = toRef(props, 'message')
  const room = toRef(props, 'room')
  const { user } = useUser()
  const { isTouchInput } = useTouchInput()
  const { isDeleteMessageDialogOpen, openDeleteMessageDialog } = useMessageDeleteDialog()
  const isMessageForwardDialogOpen = ref(false)
  const isMessageContextMenuOpen = ref(false)
  const isMessagePinned = computed(() => room.value.pinnedMessageId === message.value.id)
  const canUseRoomMemberMessageActions = computed(
    () => !isRoomSupport(room.value) || room.value.supportOwnerId === user.value.id
  )
  const messageContextMenuTrigger = computed(() => (isTouchInput.value ? 'longpress' : 'contextmenu'))

  const updateMessageContextMenuOpen = (value: boolean) => {
    isMessageContextMenuOpen.value = value
  }

  const closeMessageContextMenu = () => {
    updateMessageContextMenuOpen(false)
  }

  const openMessageForwardDialog = () => {
    isMessageForwardDialogOpen.value = true
  }

  const messageContextMenuOptions = computed<MessageContextMenuOption[]>(() => {
    const options: MessageContextMenuOption[] = [
      {
        value: 'copy-text',
        component: MessageCopyTextContextMenuItem,
        componentProps: {
          message: message.value,
          room: room.value,
          onSelect: closeMessageContextMenu
        },
        closeOnClick: false
      },
      {
        value: 'reply-message',
        component: MessageReplyContextMenuItem,
        componentProps: {
          message: message.value,
          room: room.value,
          onSelect: closeMessageContextMenu
        },
        closeOnClick: false
      },
      {
        value: 'forward-message',
        component: MessageForwardContextMenuItem,
        componentProps: {
          message: message.value,
          room: room.value,
          openDialog: openMessageForwardDialog,
          onSelect: closeMessageContextMenu
        },
        closeOnClick: false
      }
    ]

    if (canUseRoomMemberMessageActions.value) {
      options.unshift({
        value: 'reaction-picker',
        component: MessageReactionPicker,
        componentProps: {
          message: message.value,
          room: room.value,
          onSelect: closeMessageContextMenu
        },
        closeOnClick: false
      })
    }

    if (canUseRoomMemberMessageActions.value && canStartMessageEdit(message.value)) {
      options.push({
        value: 'edit-message',
        component: MessageEditContextMenuItem,
        componentProps: {
          message: message.value,
          room: room.value,
          onSelect: closeMessageContextMenu
        },
        closeOnClick: false
      })
    }

    if (canUseRoomMemberMessageActions.value) {
      options.push({
        value: isMessagePinned.value ? 'unpin-message' : 'pin-message',
        component: MessagePinContextMenuItem,
        componentProps: {
          message: message.value,
          room: room.value,
          onSelect: closeMessageContextMenu
        },
        closeOnClick: false
      })

      options.push({
        value: 'delete-message',
        component: MessageDeleteContextMenuItem,
        componentProps: {
          message: message.value,
          room: room.value,
          openDialog: openDeleteMessageDialog,
          onSelect: closeMessageContextMenu
        },
        closeOnClick: false
      })
    }

    return options
  })

  return {
    isDeleteMessageDialogOpen,
    isMessageForwardDialogOpen,
    isMessageContextMenuOpen,
    messageContextMenuTrigger,
    messageContextMenuOptions,
    updateMessageContextMenuOpen
  }
}
