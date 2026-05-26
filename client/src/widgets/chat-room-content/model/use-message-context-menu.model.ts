import { isUnknownObject } from 'global-shared'
import { computed, ref, toRef } from 'vue'

import { useI18n, useTouchInput } from 'src/shared/lib'

import { MESSAGE_CONTEXT_MENU_ACTION } from '../config/constants'
import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageContextMenuOption, MessageContextMenuProps } from '../config/types'
import MessageReactionPicker from '../ui/MessageReactionPicker.vue'

import { useMessageCopyText } from './use-message-copy-text.model'
import { useMessageDeleteDialog } from './use-message-delete-dialog.model'
import { useMessagePin } from './use-message-pin.model'

export const useMessageContextMenu = (props: MessageContextMenuProps) => {
  const message = toRef(props, 'message')
  const room = toRef(props, 'room')
  const { isTouchInput } = useTouchInput()
  const { t } = useI18n()
  const { canCopyMessageText, copyMessageText } = useMessageCopyText(message)
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
        disabled: !canCopyMessageText.value
      }
    ]

    options.push({
      label: isMessagePinned.value ? t(CHAT_ROOM_CONTENT_I18N.unpinMessage) : t(CHAT_ROOM_CONTENT_I18N.pinMessage),
      value: isMessagePinned.value
        ? MESSAGE_CONTEXT_MENU_ACTION.UNPIN_MESSAGE
        : MESSAGE_CONTEXT_MENU_ACTION.PIN_MESSAGE,
      disabled: !canUpdatePinnedMessage.value
    })

    options.push({
      label: t(CHAT_ROOM_CONTENT_I18N.deleteMessage),
      value: MESSAGE_CONTEXT_MENU_ACTION.DELETE_MESSAGE
    })

    return options
  })

  const selectMessageContextMenuAction = (option: unknown) => {
    if (!isUnknownObject(option)) return

    switch (option.value) {
      case MESSAGE_CONTEXT_MENU_ACTION.COPY_TEXT:
        void copyMessageText()
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
