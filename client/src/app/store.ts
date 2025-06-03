import { AnyAction, combineReducers, configureStore, ThunkDispatch } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { callsSlice } from 'src/entities/call'
import { chatRoomsSlice } from 'src/entities/chat-room'
import { contactsSlice } from 'src/entities/contact'
import { settingsSlice } from 'src/entities/settings'
import { systemSlice } from 'src/entities/system'
import { userSlice } from 'src/entities/user'

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
  chatRooms: chatRoomsSlice.reducer,
  contacts: contactsSlice.reducer,
  system: systemSlice.reducer,
  calls: callsSlice.reducer
})

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const persistor = persistStore(store)
