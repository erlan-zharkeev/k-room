import { createAsyncThunk } from '@reduxjs/toolkit'
import { User, AuthEndPoints } from 'common-types'
import $api from 'src/services/api'

export enum AuthAction {
  REGISTRATION = 'REGISTRATION',
  SEND_EMAIL_CONFIRMATION_LINK = 'SEND_EMAIL_CONFIRMATION_LINK',
  EMAIL_CONFIRM = 'EMAIL_CONFIRM',
  UPDATE_TOKENS_PAIR = 'UPDATE_TOKENS_PAIR'
}

export const registration = createAsyncThunk(AuthAction.REGISTRATION, async (payload: User, { dispatch }) => {
  return await $api('post', AuthEndPoints.REGISTRATION, dispatch, payload)
})

export const sendConfirmationLink = createAsyncThunk(
  AuthAction.SEND_EMAIL_CONFIRMATION_LINK,
  async (email: string, { dispatch }) => {
    const payload = { email }
    return await $api('post', AuthEndPoints.SEND_EMAIL_CONFIRMATION_LINK, dispatch, payload)
  }
)

export const sendEmailConfirm = createAsyncThunk(AuthAction.EMAIL_CONFIRM, async (userId: string, { dispatch }) => {
  const payload = { userId }
  return await $api('post', AuthEndPoints.SEND_EMAIL_CONFIRMATION, dispatch, payload)
})
