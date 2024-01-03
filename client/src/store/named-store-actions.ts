import { userSlice, roomsSlice, contactsSlice, systemSlice, settingsSlice, callsSlice } from './modules'

export const { setUserData, logOut, setInfoItems, markInfoItemAsRead } = userSlice.actions
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
  deleteMessage
} = roomsSlice.actions
export const { loadContacts, updateContactsStatus, updateContactData } = contactsSlice.actions
export const {
  setReconnectingStatus,
  showNotification,
  showModal,
  closeModal,
  setViewPort,
  setContextMenu,
  resetContextClickedObject,
  changeIsAppLoading
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
  showWallpaper
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
  setCallSettingsLoading
} = callsSlice.actions
