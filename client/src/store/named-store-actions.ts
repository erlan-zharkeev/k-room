import { userSlice, roomsSlice, contactsSlice, systemSlice, settingsSlice, callsSlice } from './modules'

export const { setUserData, logOut, setInfoItems, markInfoItemAsRead, resetUserStore } = userSlice.actions
export const {
  loadChatRooms,
  updateChatUsersStatus,
  updateChatMessage,
  pushTemporaryMessage,
  updateMessageReactions,
  updateMessageStatus,
  changeChatName,
  setRepliedMessage,
  repliedMessageSetAsForward,
  resetRepliedMessage,
  updatedAttachedFilesMessage,
  deleteMessage,
  resetRoomsStore
} = roomsSlice.actions
export const { loadContacts, updateContactsStatus, updateContactsStatusLocal, updateContactData, resetContactStore } = contactsSlice.actions
export const {
  setReconnectingStatus,
  enableAllowAudioContext,
  showModal,
  closeModal,
  setViewPort,
  setContextMenu,
  resetContextClickedObject,
  changeIsAppLoading,
  resetSystemStore
} = systemSlice.actions
export const {
  changeAsideTab,
  changeTheme,
  setSoundValue,
  setTooltipsValue,
  selectChatRoom,
  setAbleToShowNotification,
  updateSettings,
  setCurrentInfoItem,
  showWallpaper,
  resetSettings,
  setAdminPanelTab
} = settingsSlice.actions
export const {
  updateAllList,
  setCurrentCallAccepted,
  initModalToCall,
  closeCallModal,
  setMinify,
  unsetMinify,
  setCallVideo,
  setCallAudio,
  updateInterlocutorSettings,
  setCallStartedAt,
  toggleSelfStreamIsLoading,
  setShowCallModal,
  updateCalls,
  updateCall,
  setCallId,
  markCurrentCallAsVideo,
  setCallSettingsLoading,
  resetCallStore
} = callsSlice.actions

export const resetStores = [
  resetUserStore,
  resetRoomsStore,
  resetContactStore,
  resetSystemStore,
  resetSettings,
  resetCallStore
]
