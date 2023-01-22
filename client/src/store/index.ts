import { AnyAction, combineReducers, configureStore, ThunkDispatch } from '@reduxjs/toolkit'
import system, { showNotification } from './systemSlice'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import auth, { UserAction } from './userSlice'
import chatRooms from './roomsSlice'
import contacts from './contactsSlice'
import { sound, Sounds } from 'src/services/sound'
import { MessageNotification } from 'src/components/Common/MessageNotification/MessageNotification'

export type AppDispatch = ThunkDispatch<unknown, unknown, AnyAction>
export type RootState = ReturnType<typeof store.getState>
export type RootActions = UserAction

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage
  },
  combineReducers({ system })
)

const reducers = combineReducers({ persist: persistedReducer, auth, chatRooms, contacts })

const SystemMiddleware = (store: any) => (next: any) => (action: any) => {
  switch (action.type) {
    case 'rooms/updateChatMessage':
      const { soundOn } = store.getState().persist.system.settings
      const { message } = action.payload
      const dispatch = store.dispatch
      if (!message.isSelf) {
        dispatch(
          showNotification({ message: MessageNotification(message), messageType: 'info', placement: 'bottomRight' })
        )
        if (soundOn) sound(Sounds.messageDelivered).play()
      }
      break
    default:
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
