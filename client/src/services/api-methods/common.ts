import { createAsyncThunk } from '@reduxjs/toolkit'
import { CommonEndPoints } from 'common-types'
import { $api } from '..'

export const markInfoAsRead = createAsyncThunk(
  'GET_NOTIFICATION',
  async (payload: { currentInfoId: string }, { dispatch }) =>
    await $api('post', CommonEndPoints.GET_INFO, dispatch, payload)
)
