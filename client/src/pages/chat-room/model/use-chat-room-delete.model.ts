import { CHAT_KIND, type IEventDeleteChatRoom } from 'global-shared'
import { computed, ref, type Ref } from 'vue'

import { useUser } from 'src/entities/user'
import { useSocketAction } from 'src/shared/api'

import type { IChatRoomNavigationItem } from '../config/types'

export const useChatRoomDelete = (item: Ref<IChatRoomNavigationItem>) => {
  const { user } = useUser()
  const { emitSocketAction } = useSocketAction()
  const isDeletingChatRoom = ref(false)
  const isDeleteChatRoomDialogOpen = ref(false)
  const isDeleteChatRoomAvailable = computed(
    () => item.value.chatKind === CHAT_KIND.GROUP && item.value.authorId === user.value.id
  )
  const canDeleteChatRoom = computed(() => isDeleteChatRoomAvailable.value && !isDeletingChatRoom.value)

  const openDeleteChatRoomDialog = () => {
    if (!canDeleteChatRoom.value) return

    isDeleteChatRoomDialogOpen.value = true
  }

  const closeDeleteChatRoomDialog = () => {
    isDeleteChatRoomDialogOpen.value = false
  }

  const deleteChatRoom = () => {
    if (!canDeleteChatRoom.value) return

    const payload: IEventDeleteChatRoom = { roomId: item.value.id }

    isDeletingChatRoom.value = true
    void emitSocketAction<IEventDeleteChatRoom>('delete-chat-room', payload, {
      onSettled: () => {
        isDeletingChatRoom.value = false
      }
    })
    closeDeleteChatRoomDialog()
  }

  return {
    isDeletingChatRoom,
    isDeleteChatRoomDialogOpen,
    isDeleteChatRoomAvailable,
    canDeleteChatRoom,
    openDeleteChatRoomDialog,
    closeDeleteChatRoomDialog,
    deleteChatRoom
  }
}
