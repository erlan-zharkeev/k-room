import { AnyAction, combineReducers, configureStore, ThunkDispatch } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { SystemMiddleware } from './middlewares'
import user from './user-slice'
import chatRooms from './rooms-slice'
import contacts from './contacts-slice'
import system from './system-slice'
import settings from './settings-slice'
import calls from './calls-slice'

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

export { user, chatRooms, contacts, system, settings, calls }
