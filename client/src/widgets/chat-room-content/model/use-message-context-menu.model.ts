import {
  NmorphIconCopy,
  NmorphIconDelete,
  NmorphIconEdit,
  NmorphIconForwardFilled,
  NmorphIconPin,
  NmorphIconReplyFilled
} from '@nmorph/nmorph-ui-kit'
import { isUnknownObject } from 'global-shared'
import { computed, ref, toRef } from 'vue'
import type { Component } from 'vue'

import { useI18n, useTouchInput } from 'src/shared/lib'

import { MESSAGE_CONTEXT_MENU_ACTION } from '../config/constants'
import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageContextMenuOption, MessageContextMenuProps } from '../config/types'
import MessageReactionPicker from '../ui/MessageReactionPicker.vue'

import { useMessageCopyText } from './use-message-copy-text.model'
import { useMessageDeleteDialog } from './use-message-delete-dialog.model'
import { useMessageDraftReference } from './use-message-draft-reference.model'
import { useMessageEdit } from './use-message-edit.model'
import { useMessagePin } from './use-message-pin.model'

export const useMessageContextMenu = (props: MessageContextMenuProps) => {
  const message = toRef(props, 'message')
  const room = toRef(props, 'room')
  const { isTouchInput } = useTouchInput()
  const { t } = useI18n()
  const { canCopyMessageText, copyMessageText } = useMessageCopyText(message)
  const { startMessageForward, startMessageReply } = useMessageDraftReference()
  const { canStartMessageEdit, startMessageEdit } = useMessageEdit()
  const { canUpdatePinnedMessage, isMessagePinned, togglePinnedMessage } = useMessagePin(message, room)
  const { isDeleteMessageDialogOpen, openDeleteMessageDialog } = useMessageDeleteDialog()
  const isMessageContextMenuOpen = ref(false)
  const isMessageContextMenuDisabled = computed(() => isTouchInput.value)

  const updateMessageContextMenuOpen = (value: boolean) => {
    isMessageContextMenuOpen.value = value
  }

  const closeMessageContextMenu = () => {
    updateMessageContextMenuOpen(false)
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
        label: t(CHAT_ROOM_CONTENT_I18N.copyMessageText),
        value: MESSAGE_CONTEXT_MENU_ACTION.COPY_TEXT,
        icon: NmorphIconCopy as unknown as Component,
        disabled: !canCopyMessageText.value
      },
      {
        label: t(CHAT_ROOM_CONTENT_I18N.replyMessage),
        value: MESSAGE_CONTEXT_MENU_ACTION.REPLY_MESSAGE,
        icon: NmorphIconReplyFilled as unknown as Component
      },
      {
        label: t(CHAT_ROOM_CONTENT_I18N.forwardMessage),
        value: MESSAGE_CONTEXT_MENU_ACTION.FORWARD_MESSAGE,
        icon: NmorphIconForwardFilled as unknown as Component
      }
    ]

    if (canStartMessageEdit(message.value)) {
      options.push({
        label: t(CHAT_ROOM_CONTENT_I18N.editMessage),
        value: MESSAGE_CONTEXT_MENU_ACTION.EDIT_MESSAGE,
        icon: NmorphIconEdit as unknown as Component
      })
    }

    options.push({
      label: isMessagePinned.value ? t(CHAT_ROOM_CONTENT_I18N.unpinMessage) : t(CHAT_ROOM_CONTENT_I18N.pinMessage),
      value: isMessagePinned.value
        ? MESSAGE_CONTEXT_MENU_ACTION.UNPIN_MESSAGE
        : MESSAGE_CONTEXT_MENU_ACTION.PIN_MESSAGE,
      icon: NmorphIconPin as unknown as Component,
      disabled: !canUpdatePinnedMessage.value
    })

    options.push({
      label: t(CHAT_ROOM_CONTENT_I18N.deleteMessage),
      value: MESSAGE_CONTEXT_MENU_ACTION.DELETE_MESSAGE,
      icon: NmorphIconDelete as unknown as Component
    })

    return options
  })

  const selectMessageContextMenuAction = (option: unknown) => {
    if (!isUnknownObject(option)) return

    switch (option.value) {
      case MESSAGE_CONTEXT_MENU_ACTION.COPY_TEXT:
        void copyMessageText()
        break
      case MESSAGE_CONTEXT_MENU_ACTION.REPLY_MESSAGE:
        startMessageReply(message.value, room.value.id)
        closeMessageContextMenu()
        break
      case MESSAGE_CONTEXT_MENU_ACTION.FORWARD_MESSAGE:
        startMessageForward(message.value, room.value.id)
        closeMessageContextMenu()
        break
      case MESSAGE_CONTEXT_MENU_ACTION.EDIT_MESSAGE:
        startMessageEdit(message.value, room.value.id)
        closeMessageContextMenu()
        break
      case MESSAGE_CONTEXT_MENU_ACTION.PIN_MESSAGE:
      case MESSAGE_CONTEXT_MENU_ACTION.UNPIN_MESSAGE:
        togglePinnedMessage()
        break
      case MESSAGE_CONTEXT_MENU_ACTION.DELETE_MESSAGE:
        openDeleteMessageDialog()
        break
    }
  }

  return {
    isDeleteMessageDialogOpen,
    isMessageContextMenuOpen,
    isMessageContextMenuDisabled,
    messageContextMenuOptions,
    updateMessageContextMenuOpen,
    selectMessageContextMenuAction
  }
}
