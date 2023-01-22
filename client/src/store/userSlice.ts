import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AuthEndPoints, UserEndPoints, RouteNames, User } from 'common-types'
import { createBrowserHistory } from 'history'
import $api from 'src/services/api'
import clearCookie from 'src/utils/clearCookie'
import { UserState } from './@types/UserState'
import { updateSettings } from './systemSlice'

export enum UserAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  UPDATE_USER_DATA = 'UPDATE_USER_DATA',
  GET_USER_DATA = 'GET_USER_DATA'
}

const customHistory = createBrowserHistory()

export const login = createAsyncThunk(UserAction.LOGIN, async (payload: User, { dispatch }) => {
  const response = await $api('post', AuthEndPoints.LOGIN, dispatch, payload)
  dispatch(setUserData(response.data.userData))
  dispatch(updateSettings(response.data.settings))
  customHistory.push(RouteNames.MAIN)
})

export const updateUserData = createAsyncThunk(UserAction.UPDATE_USER_DATA, async (payload: User, { dispatch }) => {
  const response = await $api('post', UserEndPoints.UPDATE_USER_DATA, dispatch, payload, 'multipart/form-data')
  dispatch(setUserData(response.data.userData))
})

export const getUserData = createAsyncThunk(UserAction.GET_USER_DATA, async (_: unknown, { dispatch }) => {
  const response = await $api('get', UserEndPoints.GET_USER_DATA, dispatch)
  dispatch(setUserData(response.data.userData))
  customHistory.push(RouteNames.MAIN)
})

const initialState: UserState = {
  isAppLoading: true,
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

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeIsAppLoading: (state, { payload }) => {
      state.isAppLoading = payload
    },
    setUserData: (state, { payload }) => {
      state.isAppLoading = false
      state.isAuth = true
      state.userData = {
        ...state.userData,
        ...payload
      }
    },
    logOut: (state) => {
      clearCookie()
      state.isAuth = false
    }
  }
})

export const { setUserData, logOut, changeIsAppLoading } = userSlice.actions

export default userSlice.reducer
