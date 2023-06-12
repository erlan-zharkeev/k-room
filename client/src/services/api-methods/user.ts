import { createAsyncThunk } from '@reduxjs/toolkit'
import { User, UserEndPoints } from 'common-types'
import $api from 'src/services/$api'

export const resetPassword = createAsyncThunk(
  'RESET_PASSWORD',
  async (payload: { query: string; password: string }, { dispatch }) =>
    await $api('post', UserEndPoints.RESET_PASSWORD, dispatch, payload)
)

export const updateUserData = createAsyncThunk(
  'UPDATE_USER_DATA',
  async (payload: User, { dispatch }) =>
    await $api('post', UserEndPoints.UPDATE_USER_DATA, dispatch, payload, 'multipart/form-data')
)

export const getUserData = createAsyncThunk(
  'GET_USER_DATA',
  async (_: unknown, { dispatch }) => await $api('get', UserEndPoints.GET_USER_DATA, dispatch)
)
