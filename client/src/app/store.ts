import { AnyAction, combineReducers, configureStore, ThunkDispatch } from '@reduxjs/toolkit'

import { callsSlice } from 'src/entities/call'
import { chatRoomsSlice } from 'src/entities/chat-room'
import { systemSlice } from 'src/entities/system'
import { userSlice } from 'src/entities/user'

export type AppDispatch = ThunkDispatch<unknown, unknown, AnyAction>
export type RootState = ReturnType<typeof store.getState>

const reducers = combineReducers({
  system: systemSlice.reducer,
  user: userSlice.reducer,
  chatRooms: chatRoomsSlice.reducer,
  calls: callsSlice.reducer
})

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
