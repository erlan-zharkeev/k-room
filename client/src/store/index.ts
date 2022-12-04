import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import system from './systemSlice'

import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import auth, { AuthAction } from './authSlice'
import chatRooms from './chatRoomsSlice'
import contacts from './contactsSlice'
import { sound, Sounds } from '../sound'
import { socket } from './../socket/socket'

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type RootActions = AuthAction

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage
  },
  combineReducers({ auth, chatRooms, contacts, system })
)

const reducers = combineReducers({ persist: persistedReducer })

const SystemMiddleware = (store: any) => (next: any) => (action: any) => {
  switch (action.type) {
    case 'chatRooms/updateChatMessage':
      const { isSelf } = action.payload.message
      if (isSelf === false) sound(Sounds.messageDelivered).play()
      break
    case 'auth/logOut':
      storage.removeItem('persist:root')
      socket.disconnect()
      break
  }
  next(action)
}

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(SystemMiddleware)
})

export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
