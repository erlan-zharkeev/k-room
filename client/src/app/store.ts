import { AnyAction, combineReducers, configureStore, ThunkDispatch } from '@reduxjs/toolkit'

import { callsSlice } from 'src/entities/call'
import { systemSlice } from 'src/entities/system'

export type AppDispatchType = ThunkDispatch<unknown, unknown, AnyAction>
export type RootStateType = ReturnType<typeof store.getState>

const reducers = combineReducers({
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
