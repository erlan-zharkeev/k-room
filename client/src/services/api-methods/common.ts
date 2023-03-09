import { createAsyncThunk } from '@reduxjs/toolkit'
import { CommonEndPoints } from 'common-types'
import $api from '../$api'

export const resetPassword = createAsyncThunk(
  'reset-password',
  async (payload: { query: string; password: string }, { dispatch }) => {
    const response = await $api('post', CommonEndPoints.RESET_PASSWORD, dispatch, payload)
    return response.data
  }
)
