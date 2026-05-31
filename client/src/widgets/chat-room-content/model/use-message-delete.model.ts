import type { EventDeleteMessage } from 'global-shared'
import { computed, ref, type Ref } from 'vue'

import { useSocketAction } from 'src/shared/api'

import type { MessageDeleteDialogProps } from '../config/types'

export const useMessageDelete = (props: MessageDeleteDialogProps, isDeleteMessageDialogOpen: Ref<boolean>) => {
  const { emitSocketAction } = useSocketAction()
  const isDeletingMessage = ref(false)
  const canDeleteMessageForMe = computed(() => !isDeletingMessage.value)
  const canDeleteMessageForEveryone = computed(() => props.message.isSelf && !isDeletingMessage.value)

  const closeDeleteMessageDialog = () => {
    isDeleteMessageDialogOpen.value = false
  }

  const deleteMessage = (deleteForEveryone: boolean) => {
    if (!deleteForEveryone && !canDeleteMessageForMe.value) return
    if (deleteForEveryone && !canDeleteMessageForEveryone.value) return

    const payload: EventDeleteMessage = {
      deleteForEveryone,
      roomId: props.roomId,
      messageId: props.message.id
    }

    isDeletingMessage.value = true
    void emitSocketAction('delete-message', payload, {
      onSettled: () => {
        isDeletingMessage.value = false
      }
    })
    closeDeleteMessageDialog()
  }

  const deleteMessageForMe = () => {
    deleteMessage(false)
  }

  const deleteMessageForEveryone = () => {
    deleteMessage(true)
  }

  return {
    canDeleteMessageForMe,
    canDeleteMessageForEveryone,
    isDeletingMessage,
    closeDeleteMessageDialog,
    deleteMessageForMe,
    deleteMessageForEveryone
  }
}
