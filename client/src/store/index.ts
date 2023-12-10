import { AnyAction, combineReducers, configureStore, ThunkDispatch } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { SystemMiddleware } from './middlewares'
import { settingsSlice, userSlice, roomsSlice, contactsSlice, callsSlice, systemSlice } from './modules'

export type AppDispatch = ThunkDispatch<unknown, unknown, AnyAction>
export type RootState = ReturnType<typeof store.getState>

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage
  },
  combineReducers({ settings: settingsSlice.reducer })
)

const reducers = combineReducers({
  persist: persistedReducer,
  user: userSlice.reducer,
  chatRooms: roomsSlice.reducer,
  contacts: contactsSlice.reducer,
  system: systemSlice.reducer,
  calls: callsSlice.reducer
})

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(SystemMiddleware)
})

export { commonSetUserDataHandler } from './modules'
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
  setCurrentInfoItem
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
