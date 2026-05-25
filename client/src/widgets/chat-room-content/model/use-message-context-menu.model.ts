import { isUnknownObject } from 'global-shared'
import { computed, ref, toRef } from 'vue'

import { useI18n, useTouchInput } from 'src/shared/lib'

import { MESSAGE_CONTEXT_MENU_ACTION } from '../config/constants'
import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageContextMenuOption, MessageContextMenuProps } from '../config/types'

import { useMessageCopyText } from './use-message-copy-text.model'

export const useMessageContextMenu = (props: MessageContextMenuProps) => {
  const message = toRef(props, 'message')
  const { isTouchInput } = useTouchInput()
  const { t } = useI18n()
  const { canCopyMessageText, copyMessageText } = useMessageCopyText(message)
  const isMessageContextMenuOpen = ref(false)
  const isDeleteMessageDialogOpen = ref(false)
  const isMessageContextMenuDisabled = computed(() => isTouchInput.value)
  const messageContextMenuOptions = computed<MessageContextMenuOption[]>(() => {
    const options: MessageContextMenuOption[] = [
      {
        label: t(CHAT_ROOM_CONTENT_I18N.copyMessageText),
        value: MESSAGE_CONTEXT_MENU_ACTION.COPY_TEXT,
        disabled: !canCopyMessageText.value
      }
    ]

    options.push({
      label: t(CHAT_ROOM_CONTENT_I18N.deleteMessage),
      value: MESSAGE_CONTEXT_MENU_ACTION.DELETE_MESSAGE
    })

    return options
  })

  const updateMessageContextMenuOpen = (value: boolean) => {
    isMessageContextMenuOpen.value = value
  }

  const openDeleteMessageDialog = () => {
    isDeleteMessageDialogOpen.value = true
  }

  const selectMessageContextMenuAction = (option: unknown) => {
    if (!isUnknownObject(option)) return

    switch (option.value) {
      case MESSAGE_CONTEXT_MENU_ACTION.COPY_TEXT:
        void copyMessageText()
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
