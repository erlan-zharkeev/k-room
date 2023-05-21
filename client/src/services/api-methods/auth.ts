import { createAsyncThunk } from '@reduxjs/toolkit'
import { AuthEndPoints, CommonEndPoints, UserCredential } from 'common-types'
import $api from 'src/services/$api'

export const updateTokensPair = createAsyncThunk(
  'UPDATE_TOKENS_PAIR',
  async (_, { dispatch }) => await $api('get', AuthEndPoints.UPDATE_TOKENS_PAIR, dispatch)
)

export const registration = createAsyncThunk(
  'REGISTRATION',
  async (payload: UserCredential, { dispatch }) => await $api('post', AuthEndPoints.REGISTRATION, dispatch, payload)
)

export const login = createAsyncThunk(
  'LOGIN',
  async (payload: UserCredential, { dispatch }) => await $api('post', AuthEndPoints.LOGIN, dispatch, payload)
)

export const signInWithProvider = createAsyncThunk(
  'PROVIDER_LOGIN',
  async (payload: UserCredential, { dispatch }) => await $api('post', AuthEndPoints.PROVIDER_LOGIN, dispatch, payload)
)

export const sendConfirmationLink = createAsyncThunk(
  'SEND_EMAIL_CONFIRMATION_LINK',
  async (email: string, { dispatch }) =>
    await $api('post', AuthEndPoints.SEND_EMAIL_CONFIRMATION_LINK, dispatch, { email })
)

export const emailConfirm = createAsyncThunk(
  'EMAIL_CONFIRM',
  async (userId: string, { dispatch }) =>
    await $api('post', AuthEndPoints.SEND_EMAIL_CONFIRMATION, dispatch, { userId })
)
