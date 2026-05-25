import { ref } from 'vue'

export const useChatRoomContextMenuDialogs = () => {
  const isChatRoomFormDialogOpen = ref(false)
  const isDeleteChatRoomDialogOpen = ref(false)
  const isLeaveChatRoomDialogOpen = ref(false)

  const openChatRoomFormDialog = () => {
    isChatRoomFormDialogOpen.value = true
  }

  const openDeleteChatRoomDialog = () => {
    isDeleteChatRoomDialogOpen.value = true
  }

  const openLeaveChatRoomDialog = () => {
    isLeaveChatRoomDialogOpen.value = true
  }

  return {
    isChatRoomFormDialogOpen,
    isDeleteChatRoomDialogOpen,
    isLeaveChatRoomDialogOpen,
    openChatRoomFormDialog,
    openDeleteChatRoomDialog,
    openLeaveChatRoomDialog
  }
}
