import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { callsSlice } from 'src/shared/call'
import { systemSlice } from 'src/shared/system'

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
