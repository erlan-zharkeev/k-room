import { AnyAction, createAsyncThunk, createSlice, ThunkDispatch } from '@reduxjs/toolkit'
import { AuthEndPoints, UserEndPoints, RouteNames, User, UserCredential } from 'common-types'
import $router from 'src/services/$router'
import $api from 'src/services/$api'
import clearCookie from 'src/utils/clearCookie'
import { UserState } from './@types/UserState'
import { updateSettings } from './settingsSlice'
import { SettingsState } from './@types/SettingsState'

export enum UserAction {
  HAS_USER = 'HAS_USER',
  GOOGLE_LOGIN = 'GOOGLE_LOGIN',
  PROVIDER_LOGIN = 'PROVIDER_LOGIN',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  UPDATE_USER_DATA = 'UPDATE_USER_DATA',
  GET_USER_DATA = 'GET_USER_DATA'
}

export const login = createAsyncThunk(UserAction.LOGIN, async (payload: UserCredential, { dispatch }) => {
  const response = await $api('post', AuthEndPoints.LOGIN, dispatch, payload)
  const { userData, settings } = response.data
  commonSetUserDataHandler(dispatch, { userData, settings })
})

export const signInWithProvider = createAsyncThunk(
  UserAction.PROVIDER_LOGIN,
  async (payload: UserCredential, { dispatch }) => {
    const response = await $api('post', AuthEndPoints.PROVIDER_LOGIN, dispatch, payload)
    const { userData, settings } = response.data
    commonSetUserDataHandler(dispatch, { userData, settings })
  }
)

export const updateUserData = createAsyncThunk(UserAction.UPDATE_USER_DATA, async (payload: User, { dispatch }) => {
  const response = await $api('post', UserEndPoints.UPDATE_USER_DATA, dispatch, payload, 'multipart/form-data')
  dispatch(setUserData(response.data.userData))
})

export const getUserData = createAsyncThunk(UserAction.GET_USER_DATA, async (_: unknown, { dispatch }) => {
  const response = await $api('get', UserEndPoints.GET_USER_DATA, dispatch)
  const { userData, settings } = response.data
  commonSetUserDataHandler(dispatch, { userData, settings })
})

const commonSetUserDataHandler = (
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
  data: { userData: User; settings: SettingsState }
) => {
  dispatch(setUserData(data.userData))
  dispatch(updateSettings(data.settings))
  $router.push(RouteNames.MAIN)
}

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
  name: 'user',
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
      $router.push(RouteNames.SIGN_IN)
    }
  }
})

export const { setUserData, logOut, changeIsAppLoading } = userSlice.actions

export default userSlice.reducer
