import type { EventDeleteChatRoom } from 'global-shared'
import { computed, ref, toRef, type Ref } from 'vue'

import { useSocketAction } from 'src/shared/api'

import type { ChatRoomDeleteDialogProps } from '../config/types'

import { useChatRoomPermissions } from './use-chat-room-permissions.model'

export const useChatRoomDelete = (props: ChatRoomDeleteDialogProps, isDeleteChatRoomDialogOpen: Ref<boolean>) => {
  const item = toRef(props, 'item')
  const { emitSocketAction } = useSocketAction()
  const isDeletingChatRoom = ref(false)
  const { canShowDeleteChatRoom } = useChatRoomPermissions(item)
  const canDeleteChatRoom = computed(() => canShowDeleteChatRoom.value && !isDeletingChatRoom.value)

  const closeDeleteChatRoomDialog = () => {
    isDeleteChatRoomDialogOpen.value = false
  }

  const deleteChatRoom = () => {
    if (!canDeleteChatRoom.value) return

    const payload: EventDeleteChatRoom = { roomId: item.value.id }

    isDeletingChatRoom.value = true
    void emitSocketAction<EventDeleteChatRoom>('delete-chat-room', payload, {
      onSettled: () => {
        isDeletingChatRoom.value = false
      }
    })
    closeDeleteChatRoomDialog()
  }

  return {
    isDeletingChatRoom,
    canDeleteChatRoom,
    closeDeleteChatRoomDialog,
    deleteChatRoom
  }
}
