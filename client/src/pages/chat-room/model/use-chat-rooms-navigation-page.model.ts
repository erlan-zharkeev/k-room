import { useChatRoomsList } from './use-chat-rooms-list.model'
import { useCreateChatRoomDialog } from './use-create-chat-room-dialog.model'

export const useChatRoomsNavigationPage = () => {
  const { searchQuery, chatRoomList, showNoSearchResults, showNoChats, openChatRoom } = useChatRoomsList()

  const {
    contactSearchQuery,
    createChatName,
    isCreateChatDialogOpen,
    isCreatingChat,
    selectedContactIds,
    contactPickerList,
    acceptedContacts,
    isPrivateChatAlreadyExists,
    isGroupChat,
    canCreateChat,
    openCreateChatDialog,
    closeCreateChatDialog,
    toggleContactSelection,
    createChatRoom
  } = useCreateChatRoomDialog(openChatRoom)

  return {
    searchQuery,
    contactSearchQuery,
    createChatName,
    isCreateChatDialogOpen,
    isCreatingChat,
    selectedContactIds,
    chatRoomList,
    contactPickerList,
    acceptedContacts,
    isPrivateChatAlreadyExists,
    isGroupChat,
    canCreateChat,
    showNoSearchResults,
    showNoChats,
    openCreateChatDialog,
    closeCreateChatDialog,
    toggleContactSelection,
    createChatRoom
  }
}
