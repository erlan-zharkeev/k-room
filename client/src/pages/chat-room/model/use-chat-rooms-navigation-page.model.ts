import { ref } from 'vue'

import { useChatRoomsList } from './use-chat-rooms-list.model'

export const useChatRoomsNavigationPage = () => {
  const {
    searchQuery,
    showNoSearchResults,
    showNoChats,
    openChatRoom
  } = useChatRoomsList()
  const isCreateChatDialogOpen = ref(false)

  const openCreateChatDialog = () => {
    isCreateChatDialogOpen.value = true
  }

  return {
    searchQuery,
    isCreateChatDialogOpen,
    showNoSearchResults,
    showNoChats,
    openCreateChatDialog,
    openChatRoom
  }
}
