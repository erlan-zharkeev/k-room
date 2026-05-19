import { useChatRoomsList } from './use-chat-rooms-list.model'
import { useCreateChatRoomDialog } from './use-create-chat-room-dialog.model'

export const useChatRoomsNavigationPage = () => {
  const { searchQuery, chatRoomList, showNoSearchResults, showNoChats, openChatRoom } = useChatRoomsList()

  const {
    chatAvatarUploadKey,
    chatAvatarUploadValue,
    createChatNameInputValue,
    contactSearchQuery,
    isCreateChatDialogOpen,
    isCreatingChat,
    selectedContactIds,
    acceptedContacts,
    filteredAcceptedContacts,
    isGroupChat,
    canCreateChat,
    showNoContactSearchResults,
    openCreateChatDialog,
    closeCreateChatDialog,
    updateCreateChatName,
    updateChatAvatar,
    showUnsupportedChatAvatarFormatError,
    createChatRoom
  } = useCreateChatRoomDialog(openChatRoom)

  return {
    searchQuery,
    chatAvatarUploadKey,
    chatAvatarUploadValue,
    createChatNameInputValue,
    contactSearchQuery,
    isCreateChatDialogOpen,
    isCreatingChat,
    selectedContactIds,
    chatRoomList,
    acceptedContacts,
    filteredAcceptedContacts,
    isGroupChat,
    canCreateChat,
    showNoContactSearchResults,
    showNoSearchResults,
    showNoChats,
    openCreateChatDialog,
    closeCreateChatDialog,
    updateCreateChatName,
    updateChatAvatar,
    showUnsupportedChatAvatarFormatError,
    createChatRoom
  }
}
