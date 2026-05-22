import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit'

import { store } from '../store'

export type AppDispatch = ThunkDispatch<unknown, unknown, AnyAction>
export type RootState = ReturnType<typeof store.getState>
