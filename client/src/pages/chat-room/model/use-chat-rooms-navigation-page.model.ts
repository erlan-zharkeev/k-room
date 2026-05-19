import { ref } from 'vue'

import { useChatRoomsList } from './use-chat-rooms-list.model'

export const useChatRoomsNavigationPage = () => {
  const { searchQuery, chatRoomList, showNoSearchResults, showNoChats, openChatRoom } = useChatRoomsList()
  const isCreateChatDialogOpen = ref(false)

  const openCreateChatDialog = () => {
    isCreateChatDialogOpen.value = true
  }

  return {
    searchQuery,
    isCreateChatDialogOpen,
    chatRoomList,
    showNoSearchResults,
    showNoChats,
    openCreateChatDialog,
    openChatRoom
  }
}
