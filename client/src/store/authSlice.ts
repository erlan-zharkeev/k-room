import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AuthEndPoints, RouteNames, User } from 'common-types'
import { createBrowserHistory } from 'history'
import $api from 'src/services/api'
import { socket } from 'src/socket/socket'
import clearCookie from 'src/utils/clearCookie'
import { AuthState } from './@types/AuthState'

export enum AuthAction {
  REGISTRATION = 'REGISTRATION',
  SEND_EMAIL_CONFIRMATION_LINK = 'SEND_EMAIL_CONFIRMATION_LINK',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  UPDATE = 'UPDATE',
  EMAIL_CONFIRM = 'EMAIL_CONFIRM',
  GET_USER_DATA = 'GET_USER_DATA',
  UPDATE_TOKENS_PAIR = 'UPDATE_TOKENS_PAIR'
}

const customHistory = createBrowserHistory()

export const getUserData = createAsyncThunk(AuthAction.GET_USER_DATA, async (_: unknown, { dispatch }) => {
  const response = await $api('get', AuthEndPoints.GET_USER_DATA, dispatch)
  dispatch(setUserData(response.data.userData))
  customHistory.push(RouteNames.MAIN)
})

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

export const login = createAsyncThunk(AuthAction.LOGIN, async (payload: User, { dispatch }) => {
  const response = await $api('post', AuthEndPoints.LOGIN, dispatch, payload)
  dispatch(setUserData(response.data.userData))
  customHistory.push(RouteNames.MAIN)
})

export const updateUserData = createAsyncThunk(AuthAction.UPDATE, async (payload: User, { dispatch }) => {
  const response = await $api('post', AuthEndPoints.UPDATE_USER_DATA, dispatch, payload, 'multipart/form-data')
  dispatch(setUserData(response.data.userData))
})

const initialState: AuthState = {
  isAuth: false,
  userData: {
    id: '',
    email: '',
    username: '',
    online: false,
    chatRooms: [],
    contacts: [],
    avatar: ''
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData: (state, { payload }) => {
      state.isAuth = true
      state.userData = {
        ...state.userData,
        ...payload
      }
    },
    logOut: (state) => {
      clearCookie()
      state.isAuth = false
      socket.disconnect()
    }
  }
})

export const { setUserData, logOut } = authSlice.actions

export default authSlice.reducer
