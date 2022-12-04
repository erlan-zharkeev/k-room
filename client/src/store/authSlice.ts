import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AuthState } from './@types/AuthState'
import { AuthEndPoints, RouteNames, Status, User } from './../../../types'
import { apiService } from '../services/apiService'
import axios, { AxiosResponse } from 'axios'

import { createBrowserHistory } from 'history'
import { showNotification } from './systemSlice'

export enum AuthAction {
  REGISTRATION = 'REGISTRATION',
  SEND_EMAIL_CONFIRMATION_LINK = 'SEND_EMAIL_CONFIRMATION_LINK',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  UPDATE = 'UPDATE',
  EMAIL_CONFIRM = 'EMAIL_CONFIRM'
}

type RequestTypes = 'post' | 'get'

const customHistory = createBrowserHistory()

const responseErrorHandler = (e: any, dispatch: any): void => {
  const message = e.response.data.message ?? `An error has occurred, please try again later. ERROR: ${e.message}`
  dispatch(showNotification({ message, messageType: 'error' }))
}

const responseMessageHandler = (response: AxiosResponse, dispatch: any) => {
  if (!response) return
  const message = response.data.message
  const isSuccess = response.status === Status.SUCCESS
  if (message) dispatch(showNotification({ message, messageType: isSuccess ? 'success' : 'warning' }))
}

const requestHandler = async (
  type: RequestTypes,
  endpoint: string,
  payload: any,
  dispatch: any,
  contentType: string = 'application/json'
): Promise<AxiosResponse<any, any>> => {
  let response: AxiosResponse | null = null
  try {
    response = await axios[type](endpoint, payload, {
      headers: {
        'Content-Type': contentType
      }
    })
  } catch (e: unknown) {
    responseErrorHandler(e, dispatch)
  } finally {
    return response
  }
}

export const registration = createAsyncThunk(
  AuthAction.REGISTRATION,
  async (credential: User, { dispatch }) =>
    await requestHandler('post', AuthEndPoints.REGISTRATION, credential, dispatch)
)

export const sendConfirmationLink = createAsyncThunk(
  AuthAction.SEND_EMAIL_CONFIRMATION_LINK,
  async (email: string, { dispatch }) =>
    await requestHandler('post', AuthEndPoints.SEND_EMAIL_CONFIRMATION_LINK, { email }, dispatch)
)

export const sendEmailConfirm = createAsyncThunk(
  AuthAction.EMAIL_CONFIRM,
  async (userId: string, { dispatch }) =>
    await requestHandler('post', AuthEndPoints.SEND_EMAIL_CONFIRMATION, { userId }, dispatch)
)

export const login = createAsyncThunk(AuthAction.LOGIN, async (credential: User, { dispatch }) => {
  const response = await requestHandler('post', AuthEndPoints.LOGIN, credential, dispatch)
  dispatch(setUserData(response.data.userData))
  customHistory.push(RouteNames.MAIN)
  responseMessageHandler(response, dispatch)
})

export const updateUserData = createAsyncThunk(AuthAction.UPDATE, async (credential: User, { dispatch }) => {
  const response = await requestHandler(
    'post',
    AuthEndPoints.UPDATE_USER_DATA,
    credential,
    { dispatch },
    'multipart/form-data'
  )
  dispatch(setUserData(response.data.userData))
  responseMessageHandler(response, dispatch)
})

export const signOut = createAsyncThunk(
  AuthAction.LOGOUT,
  async (_, { dispatch }) => await apiService(dispatch, AuthAction.LOGOUT)
)

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
      state.isAuth = false
    }
  }
})

export const { setUserData, logOut } = authSlice.actions

export default authSlice.reducer
