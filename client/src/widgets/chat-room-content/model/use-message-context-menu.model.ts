import { computed, ref, toRef } from 'vue'

import { useTouchInput } from 'src/shared/lib'

import { MESSAGE_CONTEXT_MENU_ACTION, MESSAGE_CONTEXT_MENU_TRIGGER } from '../config/constants'
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
  const { isTouchInput } = useTouchInput()
  const { isDeleteMessageDialogOpen, openDeleteMessageDialog } = useMessageDeleteDialog()
  const isMessageForwardDialogOpen = ref(false)
  const isMessageContextMenuOpen = ref(false)
  const isMessagePinned = computed(() => room.value.pinnedMessageId === message.value.id)
  const messageContextMenuTrigger = computed(() =>
    isTouchInput.value ? MESSAGE_CONTEXT_MENU_TRIGGER.LONG_PRESS : MESSAGE_CONTEXT_MENU_TRIGGER.CONTEXT_MENU
  )

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
        value: MESSAGE_CONTEXT_MENU_ACTION.REACTION_PICKER,
        component: MessageReactionPicker,
        componentProps: {
          message: message.value,
          room: room.value,
          onSelect: closeMessageContextMenu
        },
        closeOnClick: false
      },
      {
        value: MESSAGE_CONTEXT_MENU_ACTION.COPY_TEXT,
        component: MessageCopyTextContextMenuItem,
        componentProps: {
          message: message.value,
          room: room.value,
          onSelect: closeMessageContextMenu
        },
        closeOnClick: false
      },
      {
        value: MESSAGE_CONTEXT_MENU_ACTION.REPLY_MESSAGE,
        component: MessageReplyContextMenuItem,
        componentProps: {
          message: message.value,
          room: room.value,
          onSelect: closeMessageContextMenu
        },
        closeOnClick: false
      },
      {
        value: MESSAGE_CONTEXT_MENU_ACTION.FORWARD_MESSAGE,
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

    if (canStartMessageEdit(message.value)) {
      options.push({
        value: MESSAGE_CONTEXT_MENU_ACTION.EDIT_MESSAGE,
        component: MessageEditContextMenuItem,
        componentProps: {
          message: message.value,
          room: room.value,
          onSelect: closeMessageContextMenu
        },
        closeOnClick: false
      })
    }

    options.push({
      value: isMessagePinned.value
        ? MESSAGE_CONTEXT_MENU_ACTION.UNPIN_MESSAGE
        : MESSAGE_CONTEXT_MENU_ACTION.PIN_MESSAGE,
      component: MessagePinContextMenuItem,
      componentProps: {
        message: message.value,
        room: room.value,
        onSelect: closeMessageContextMenu
      },
      closeOnClick: false
    })

    options.push({
      value: MESSAGE_CONTEXT_MENU_ACTION.DELETE_MESSAGE,
      component: MessageDeleteContextMenuItem,
      componentProps: {
        message: message.value,
        room: room.value,
        openDialog: openDeleteMessageDialog,
        onSelect: closeMessageContextMenu
      },
      closeOnClick: false
    })

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
