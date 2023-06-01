import { AnyAction, combineReducers, configureStore, ThunkDispatch } from '@reduxjs/toolkit'
import system from './systemSlice'
import settings from './settingsSlice'
import calls from './callsSlice'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import user from './userSlice'
import chatRooms from './roomsSlice'
import contacts from './contactsSlice'
import SystemMiddleware from './middlewares/systemMiddleware'
export type AppDispatch = ThunkDispatch<unknown, unknown, AnyAction>
export type RootState = ReturnType<typeof store.getState>

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage
  },
  combineReducers({ settings })
)

const reducers = combineReducers({ persist: persistedReducer, user, chatRooms, contacts, system, calls })

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(SystemMiddleware)
})
