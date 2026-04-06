import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit'

import { store } from '../store'

export type AppDispatchType = ThunkDispatch<unknown, unknown, AnyAction>
export type RootStateType = ReturnType<typeof store.getState>
